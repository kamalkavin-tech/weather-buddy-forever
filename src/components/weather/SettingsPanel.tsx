import { useState } from "react";
import { KeyRound, X } from "lucide-react";
import { getApiKey, setApiKey, USE_MOCK_DATA } from "@/lib/weather";

/** Lets users plug in their own free-tier API key; stored locally only. */
export function SettingsPanel({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(() => getApiKey());
  const [saved, setSaved] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setValue(getApiKey());
          setSaved(false);
          setOpen(true);
        }}
        aria-label="Weather data settings"
        className="glass-panel rounded-full p-2.5 transition-colors hover:bg-foreground/10"
      >
        <KeyRound className="size-4" strokeWidth={1.8} aria-hidden />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg">Data source</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add an OpenWeatherMap key to enable live mode. Without a key the app runs entirely
                  on its built-in offline dataset.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close settings">
                <X className="size-4 opacity-70" strokeWidth={1.8} />
              </button>
            </div>

            <label
              htmlFor="apiKey"
              className="mt-6 block text-xs tracking-[0.16em] text-muted-foreground uppercase"
            >
              API key
            </label>
            <input
              id="apiKey"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste your free-tier key"
              className="mt-2 w-full rounded-2xl bg-foreground/5 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:bg-foreground/10"
            />

            {USE_MOCK_DATA && (
              <p className="mt-3 text-xs text-muted-foreground">
                Developer flag USE_MOCK_DATA is on — offline data is forced regardless of the key.
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              {saved && <span className="text-xs text-muted-foreground">Saved</span>}
              <button
                type="button"
                onClick={() => {
                  setApiKey(value);
                  setSaved(true);
                  onSaved();
                }}
                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Save key
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
