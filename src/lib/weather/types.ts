/**
 * Shared weather domain types.
 * Both MockWeatherService and LiveWeatherService produce these shapes,
 * so the UI never needs to know where the data came from.
 */

export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "stormy" | "snowy";

export interface ForecastDay {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  condition: WeatherCondition;
  /** Celsius */
  high: number;
  /** Celsius */
  low: number;
}

export interface WeatherSnapshot {
  city: string;
  country: string;
  condition: WeatherCondition;
  /** Celsius */
  temperature: number;
  /** Celsius */
  feelsLike: number;
  /** Percentage 0-100 */
  humidity: number;
  /** km/h */
  windSpeed: number;
  /** hPa */
  pressure: number;
  /** ISO timestamp of when this snapshot was produced */
  updatedAt: string;
  forecast: ForecastDay[];
}

export interface CityOption {
  id: string;
  name: string;
  country: string;
}

/** The contract every data source must satisfy. */
export interface WeatherService {
  /** Human readable source label, used by the mode indicator. */
  readonly source: "mock" | "live";
  listCities(): Promise<CityOption[]>;
  getWeather(cityId: string): Promise<WeatherSnapshot>;
}

export type DataMode = "live" | "offline" | "cached";
