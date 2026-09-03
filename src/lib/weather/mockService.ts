import { MOCK_CITIES, buildMockSnapshot } from "./mockData";
import type { CityOption, WeatherService, WeatherSnapshot } from "./types";

/**
 * Offline data source. Reads from the bundled JSON-like dataset in mockData.ts.
 * Never throws and never touches the network.
 */
export const mockWeatherService: WeatherService = {
  source: "mock",

  async listCities(): Promise<CityOption[]> {
    return MOCK_CITIES.map(({ id, name, country }) => ({ id, name, country }));
  },

  async getWeather(cityId: string): Promise<WeatherSnapshot> {
    const seed = MOCK_CITIES.find((c) => c.id === cityId) ?? MOCK_CITIES[0]!;
    return buildMockSnapshot(seed);
  },
};
