import { Droplets, Wind, Gauge, Thermometer } from "lucide-react";
import type { WeatherSnapshot } from "@/lib/weather";
import { toDisplayTemp } from "@/lib/weather";
import { WeatherIcon } from "./WeatherIcon";

const CONDITION_LABEL = {
  sunny: "Clear skies",
  cloudy: "Overcast",
  rainy: "Rain showers",
  stormy: "Thunderstorms",
  snowy: "Snowfall",
} as const;

export function WeatherCard({
  snapshot,
  unit,
}: {
  snapshot: WeatherSnapshot;
  unit: "C" | "F";
}) {
  const stats = [
    { icon: Thermometer, label: "Feels like", value: `${toDisplayTemp(snapshot.feelsLike, unit)}°` },
    { icon: Droplets, label: "Humidity", value: `${snapshot.humidity}%` },
    { icon: Wind, label: "Wind", value: `${snapshot.windSpeed} km/h` },
    { icon: Gauge, label: "Pressure", value: `${snapshot.pressure} hPa` },
  ];

  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {snapshot.city} · {snapshot.country}
          </p>
          <div className="mt-3 flex items-start">
            <span className="font-display text-7xl leading-none sm:text-8xl">
              {toDisplayTemp(snapshot.temperature, unit)}
            </span>
            <span className="font-display mt-2 text-2xl opacity-70">°{unit}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {CONDITION_LABEL[snapshot.condition]} · updated{" "}
            {new Date(snapshot.updatedAt).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <WeatherIcon condition={snapshot.condition} className="size-24 opacity-90 sm:size-28" />
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl bg-foreground/5 px-4 py-3">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="size-3.5" strokeWidth={1.8} aria-hidden />
              {label}
            </dt>
            <dd className="font-display mt-1.5 text-lg">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
