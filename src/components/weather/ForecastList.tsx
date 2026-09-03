import type { ForecastDay } from "@/lib/weather";
import { toDisplayTemp } from "@/lib/weather";
import { WeatherIcon } from "./WeatherIcon";

function dayLabel(iso: string, index: number) {
  if (index === 0) return "Today";
  return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" });
}

export function ForecastList({ days, unit }: { days: ForecastDay[]; unit: "C" | "F" }) {
  return (
    <section aria-label="Extended forecast" className="space-y-3">
      <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Next days
      </h2>
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day, i) => (
          <li
            key={day.date}
            className="glass-panel flex flex-col items-center gap-2.5 rounded-2xl px-3 py-4"
          >
            <span className="text-xs tracking-wide text-muted-foreground">
              {dayLabel(day.date, i)}
            </span>
            <WeatherIcon condition={day.condition} className="size-7" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-lg">{toDisplayTemp(day.high, unit)}°</span>
              <span className="text-sm text-muted-foreground">{toDisplayTemp(day.low, unit)}°</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
