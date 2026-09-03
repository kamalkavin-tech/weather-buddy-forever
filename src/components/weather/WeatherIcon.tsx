import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun } from "lucide-react";
import type { WeatherCondition } from "@/lib/weather";
import { cn } from "@/lib/utils";

const ICONS = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
  snowy: CloudSnow,
} as const;

export function WeatherIcon({
  condition,
  className,
}: {
  condition: WeatherCondition;
  className?: string;
}) {
  const Icon = ICONS[condition];
  return <Icon className={cn("text-foreground", className)} strokeWidth={1.4} aria-hidden />;
}
