import type { WeatherCondition, WeatherSnapshot } from "./types";

/**
 * Local offline dataset.
 * Add a new entry here to extend the offline city list — nothing else needs to change.
 */

interface MockCitySeed {
  id: string;
  name: string;
  country: string;
  condition: WeatherCondition;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  /** 7 day [condition, high, low] tuples */
  forecast: Array<[WeatherCondition, number, number]>;
}

export const MOCK_CITIES: MockCitySeed[] = [
  {
    id: "chennai",
    name: "Chennai",
    country: "IN",
    condition: "sunny",
    temperature: 34,
    feelsLike: 38,
    humidity: 62,
    windSpeed: 14,
    pressure: 1008,
    forecast: [
      ["sunny", 35, 27],
      ["sunny", 34, 27],
      ["cloudy", 33, 26],
      ["rainy", 30, 25],
      ["rainy", 29, 25],
      ["cloudy", 32, 26],
      ["sunny", 34, 27],
    ],
  },
  {
    id: "london",
    name: "London",
    country: "GB",
    condition: "rainy",
    temperature: 12,
    feelsLike: 10,
    humidity: 84,
    windSpeed: 22,
    pressure: 1002,
    forecast: [
      ["rainy", 13, 8],
      ["rainy", 12, 8],
      ["cloudy", 14, 9],
      ["cloudy", 15, 10],
      ["sunny", 17, 11],
      ["rainy", 13, 9],
      ["stormy", 11, 7],
    ],
  },
  {
    id: "reykjavik",
    name: "Reykjavik",
    country: "IS",
    condition: "snowy",
    temperature: -3,
    feelsLike: -9,
    humidity: 78,
    windSpeed: 31,
    pressure: 995,
    forecast: [
      ["snowy", -1, -7],
      ["snowy", -2, -8],
      ["cloudy", 1, -4],
      ["snowy", 0, -6],
      ["stormy", -1, -9],
      ["cloudy", 2, -3],
      ["snowy", -1, -6],
    ],
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "JP",
    condition: "cloudy",
    temperature: 19,
    feelsLike: 18,
    humidity: 66,
    windSpeed: 11,
    pressure: 1014,
    forecast: [
      ["cloudy", 20, 14],
      ["sunny", 22, 15],
      ["sunny", 23, 16],
      ["rainy", 19, 14],
      ["cloudy", 20, 15],
      ["cloudy", 21, 15],
      ["sunny", 24, 17],
    ],
  },
  {
    id: "miami",
    name: "Miami",
    country: "US",
    condition: "stormy",
    temperature: 27,
    feelsLike: 31,
    humidity: 90,
    windSpeed: 45,
    pressure: 989,
    forecast: [
      ["stormy", 28, 24],
      ["stormy", 27, 24],
      ["rainy", 29, 25],
      ["cloudy", 30, 25],
      ["sunny", 31, 26],
      ["sunny", 32, 26],
      ["rainy", 29, 25],
    ],
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "EG",
    condition: "sunny",
    temperature: 31,
    feelsLike: 30,
    humidity: 28,
    windSpeed: 17,
    pressure: 1016,
    forecast: [
      ["sunny", 33, 20],
      ["sunny", 34, 21],
      ["sunny", 35, 22],
      ["cloudy", 32, 21],
      ["sunny", 33, 20],
      ["sunny", 34, 21],
      ["cloudy", 31, 19],
    ],
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "AU",
    condition: "cloudy",
    temperature: 21,
    feelsLike: 21,
    humidity: 59,
    windSpeed: 19,
    pressure: 1011,
    forecast: [
      ["cloudy", 22, 16],
      ["sunny", 24, 17],
      ["rainy", 20, 15],
      ["rainy", 19, 15],
      ["cloudy", 21, 16],
      ["sunny", 25, 18],
      ["sunny", 26, 19],
    ],
  },
  {
    id: "oslo",
    name: "Oslo",
    country: "NO",
    condition: "snowy",
    temperature: 1,
    feelsLike: -4,
    humidity: 81,
    windSpeed: 13,
    pressure: 1005,
    forecast: [
      ["snowy", 2, -3],
      ["cloudy", 3, -2],
      ["snowy", 1, -5],
      ["snowy", 0, -6],
      ["cloudy", 4, -1],
      ["sunny", 6, 0],
      ["rainy", 5, 1],
    ],
  },
];

/** Builds forward-dated ISO dates so the forecast strip always looks current. */
function isoDateOffset(days: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function buildMockSnapshot(seed: MockCitySeed): WeatherSnapshot {
  return {
    city: seed.name,
    country: seed.country,
    condition: seed.condition,
    temperature: seed.temperature,
    feelsLike: seed.feelsLike,
    humidity: seed.humidity,
    windSpeed: seed.windSpeed,
    pressure: seed.pressure,
    updatedAt: new Date().toISOString(),
    forecast: seed.forecast.map(([condition, high, low], i) => ({
      date: isoDateOffset(i),
      condition,
      high,
      low,
    })),
  };
}
