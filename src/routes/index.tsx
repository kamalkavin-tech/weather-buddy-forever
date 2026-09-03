import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  fetchWeather,
  loadPref,
  mockWeatherService,
  savePref,
  type CityOption,
  type DataMode,
  type WeatherSnapshot,
} from "@/lib/weather";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { ForecastList } from "@/components/weather/ForecastList";
import { SearchBar } from "@/components/weather/SearchBar";
import { ModeIndicator } from "@/components/weather/ModeIndicator";
import { SettingsPanel } from "@/components/weather/SettingsPanel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skyfall — Offline-First Weather Dashboard" },
      {
        name: "description",
        content:
          "A weather dashboard that keeps working without internet: local dataset, cached live data, and an optional pluggable weather API.",
      },
      { property: "og:title", content: "Skyfall — Offline-First Weather Dashboard" },
      {
        property: "og:description",
        content:
          "Current conditions and a 7-day forecast that never break when the network does. Live API optional.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [cities, setCities] = useState<CityOption[]>([]);
  const [cityId, setCityId] = useState("chennai");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [mode, setMode] = useState<DataMode>("offline");

  // Restore saved preferences on the client only (avoids hydration mismatch).
  useEffect(() => {
    const savedUnit = loadPref("unit");
    const savedCity = loadPref("city");
    if (savedUnit === "C" || savedUnit === "F") setUnit(savedUnit);
    if (savedCity) setCityId(savedCity);
    mockWeatherService.listCities().then(setCities);
  }, []);

  const load = useCallback(async (id: string) => {
    const result = await fetchWeather(id);
    setSnapshot(result.snapshot);
    setMode(result.mode);
  }, []);

  useEffect(() => {
    void load(cityId);
  }, [cityId, load]);

  // Re-evaluate the data source whenever connectivity flips.
  useEffect(() => {
    const handler = () => void load(cityId);
    window.addEventListener("online", handler);
    window.addEventListener("offline", handler);
    return () => {
      window.removeEventListener("online", handler);
      window.removeEventListener("offline", handler);
    };
  }, [cityId, load]);

  const selectCity = (id: string) => {
    setCityId(id);
    savePref("city", id);
  };

  const toggleUnit = (next: "C" | "F") => {
    setUnit(next);
    savePref("unit", next);
  };

  return (
    <main
      className={cn(
        "min-h-screen px-4 py-8 sm:px-8 sm:py-12",
        snapshot ? `sky-${snapshot.condition}` : "",
      )}
      style={{ backgroundImage: "var(--sky)", backgroundAttachment: "fixed" }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl">Skyfall</h1>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Offline-first weather
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <ModeIndicator mode={mode} />
            <div className="glass-panel flex rounded-full p-1">
              {(["C", "F"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => toggleUnit(u)}
                  aria-pressed={unit === u}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    unit === u ? "bg-foreground text-background" : "text-muted-foreground",
                  )}
                >
                  °{u}
                </button>
              ))}
            </div>
            <SettingsPanel onSaved={() => void load(cityId)} />
          </div>
        </header>

        <SearchBar cities={cities} selectedId={cityId} onSelect={selectCity} />

        {snapshot ? (
          <>
            <WeatherCard snapshot={snapshot} unit={unit} />
            <ForecastList days={snapshot.forecast} unit={unit} />
          </>
        ) : (
          <div className="glass-panel h-64 animate-pulse rounded-3xl" />
        )}

        <p className="text-xs text-muted-foreground">
          No API key configured? The dashboard runs on its bundled dataset. Add a free-tier key in
          settings to switch to live data — the last successful response is cached for the next
          outage.
        </p>
      </div>
    </main>
  );
}
