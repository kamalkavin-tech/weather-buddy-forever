import { Radio, WifiOff, Database } from "lucide-react";
import type { DataMode } from "@/lib/weather";

const CONFIG: Record<DataMode, { label: string; hint: string; icon: typeof Radio }> = {
  live: { label: "Live", hint: "Streaming from the weather API", icon: Radio },
  cached: { label: "Cached", hint: "Showing last synced data", icon: Database },
  offline: { label: "Offline", hint: "Using the local dataset", icon: WifiOff },
};

export function ModeIndicator({ mode }: { mode: DataMode }) {
  const { label, hint, icon: Icon } = CONFIG[mode];
  return (
    <div className="glass-panel flex items-center gap-2.5 rounded-full px-3.5 py-2" title={hint}>
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: `var(--mode-${mode})`, boxShadow: `0 0 10px var(--mode-${mode})` }}
      />
      <Icon className="size-3.5 opacity-70" strokeWidth={1.8} aria-hidden />
      <span className="text-xs font-medium tracking-[0.14em] uppercase">{label}</span>
    </div>
  );
}
