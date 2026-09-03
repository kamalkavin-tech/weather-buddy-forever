import { MOCK_CITIES } from "./mockData";
import type {
  CityOption,
  ForecastDay,
  WeatherCondition,
  WeatherService,
  WeatherSnapshot,
} from "./types";

/**
 * Optional live data source (OpenWeatherMap free tier).
 * Swap this file out to plug in a different provider — the rest of the app
 * only depends on the WeatherService contract.
 */

/** Maps OpenWeatherMap condition groups onto our five visual conditions. */
function mapCondition(owmMain: string): WeatherCondition {
  const m = owmMain.toLowerCase();
  if (m.includes("thunder")) return "stormy";
  if (m.includes("snow")) return "snowy";
  if (m.includes("rain") || m.includes("drizzle")) return "rainy";
  if (m.includes("cloud") || m.includes("mist") || m.includes("fog")) return "cloudy";
  return "sunny";
}

export function createLiveWeatherService(apiKey: string): WeatherService {
  return {
    source: "live",

    async listCities(): Promise<CityOption[]> {
      // The live provider has no city index on the free tier, so we reuse the
      // local city list for selection and resolve names against the API.
      return MOCK_CITIES.map(({ id, name, country }) => ({ id, name, country }));
    },

    async getWeather(cityId: string): Promise<WeatherSnapshot> {
      const seed = MOCK_CITIES.find((c) => c.id === cityId) ?? MOCK_CITIES[0];
      const q = `${seed.name},${seed.country}`;
      const base = "https://api.openweathermap.org/data/2.5";

      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${base}/weather?q=${encodeURIComponent(q)}&units=metric&appid=${apiKey}`),
        fetch(`${base}/forecast?q=${encodeURIComponent(q)}&units=metric&appid=${apiKey}`),
      ]);

      if (!currentRes.ok) throw new Error(`Live weather request failed (${currentRes.status})`);
      const current = (await currentRes.json()) as {
        main: { temp: number; feels_like: number; humidity: number; pressure: number };
        wind: { speed: number };
        weather: Array<{ main: string }>;
      };

      // Collapse the 3-hourly forecast into per-day highs/lows.
      const byDay = new Map<string, { highs: number[]; lows: number[]; conditions: string[] }>();
      if (forecastRes.ok) {
        const data = (await forecastRes.json()) as {
          list: Array<{
            dt_txt: string;
            main: { temp_max: number; temp_min: number };
            weather: Array<{ main: string }>;
          }>;
        };
        for (const item of data.list) {
          const day = item.dt_txt.slice(0, 10);
          const bucket = byDay.get(day) ?? { highs: [], lows: [], conditions: [] };
          bucket.highs.push(item.main.temp_max);
          bucket.lows.push(item.main.temp_min);
          bucket.conditions.push(item.weather[0]?.main ?? "Clear");
          byDay.set(day, bucket);
        }
      }

      const forecast: ForecastDay[] = [...byDay.entries()].slice(0, 7).map(([date, b]) => ({
        date,
        condition: mapCondition(b.conditions[Math.floor(b.conditions.length / 2)] ?? "Clear"),
        high: Math.round(Math.max(...b.highs)),
        low: Math.round(Math.min(...b.lows)),
      }));

      return {
        city: seed.name,
        country: seed.country,
        condition: mapCondition(current.weather[0]?.main ?? "Clear"),
        temperature: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6),
        pressure: current.main.pressure,
        updatedAt: new Date().toISOString(),
        forecast,
      };
    },
  };
}
