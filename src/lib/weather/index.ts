import { createLiveWeatherService } from "./liveService";
import { mockWeatherService } from "./mockService";
import type { DataMode, WeatherService, WeatherSnapshot } from "./types";

export * from "./types";
export { mockWeatherService } from "./mockService";
export { createLiveWeatherService } from "./liveService";

/**
 * Developer switch. Set to `true` to force the offline dataset even when an
 * API key and a network connection are available (useful for UI testing).
 */
export const USE_MOCK_DATA = false;

const API_KEY_STORAGE = "weather.apiKey";
const UNIT_STORAGE = "weather.unit";
const CITY_STORAGE = "weather.city";
const CACHE_PREFIX = "weather.cache.";

const isBrowser = typeof window !== "undefined";

export function getApiKey(): string {
  if (!isBrowser) return "";
  return window.localStorage.getItem(API_KEY_STORAGE) ?? "";
}

export function setApiKey(key: string) {
  if (!isBrowser) return;
  if (key.trim()) window.localStorage.setItem(API_KEY_STORAGE, key.trim());
  else window.localStorage.removeItem(API_KEY_STORAGE);
}

export function loadPref(kind: "unit" | "city"): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(kind === "unit" ? UNIT_STORAGE : CITY_STORAGE);
}

export function savePref(kind: "unit" | "city", value: string) {
  if (!isBrowser) return;
  window.localStorage.setItem(kind === "unit" ? UNIT_STORAGE : CITY_STORAGE, value);
}

/** Caches the last successful live snapshot per city. */
export function cacheSnapshot(cityId: string, snapshot: WeatherSnapshot) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(CACHE_PREFIX + cityId, JSON.stringify(snapshot));
  } catch {
    /* storage full or unavailable — caching is best-effort */
  }
}

export function readCachedSnapshot(cityId: string): WeatherSnapshot | null {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + cityId);
    return raw ? (JSON.parse(raw) as WeatherSnapshot) : null;
  } catch {
    return null;
  }
}

export function isOnline(): boolean {
  if (!isBrowser) return false;
  return window.navigator.onLine;
}

/** Picks the right implementation for the current environment. */
export function resolveService(): WeatherService {
  const key = getApiKey();
  if (USE_MOCK_DATA || !key || !isOnline()) return mockWeatherService;
  return createLiveWeatherService(key);
}

export interface WeatherResult {
  snapshot: WeatherSnapshot;
  mode: DataMode;
}

/**
 * Resilient fetch: try live → fall back to the cached snapshot → fall back to
 * the bundled offline dataset. This path never rejects.
 */
export async function fetchWeather(cityId: string): Promise<WeatherResult> {
  const service = resolveService();

  if (service.source === "live") {
    try {
      const snapshot = await service.getWeather(cityId);
      cacheSnapshot(cityId, snapshot);
      return { snapshot, mode: "live" };
    } catch {
      const cached = readCachedSnapshot(cityId);
      if (cached) return { snapshot: cached, mode: "cached" };
    }
  } else {
    const cached = readCachedSnapshot(cityId);
    if (cached && !USE_MOCK_DATA && !isOnline()) return { snapshot: cached, mode: "cached" };
  }

  return { snapshot: await mockWeatherService.getWeather(cityId), mode: "offline" };
}

export function toDisplayTemp(celsius: number, unit: "C" | "F"): number {
  return unit === "C" ? Math.round(celsius) : Math.round(celsius * 1.8 + 32);
}
