"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

type Settings = {
  receive_newsletter?: boolean;
  dark_mode?: boolean;
  [key: string]: any;
};

export default function SettingsForm({ initialSettings }: { initialSettings?: Settings }) {
  const [settings, setSettings] = useState<Settings>(initialSettings ?? { receive_newsletter: true, dark_mode: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // local theme key to persist optimistic changes quickly
  const THEME_KEY = "bayside.theme";

  useEffect(() => {
    // apply theme on mount: prefer localStorage, then user settings
    try {
      const stored = localStorage.getItem(THEME_KEY);
      const preferDark = stored ? stored === "dark" : !!settings.dark_mode;
      if (preferDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch {
      if (settings.dark_mode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
  }, []);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  function client() {
    if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase not configured");
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  async function handleSave() {
    setLoading(true);
    setMessage(null);
    try {
      const supa = client();
      const { error } = await supa.auth.updateUser({ data: { settings } });
      if (error) setMessage(error.message);
      else setMessage("Settings saved.");
    } catch (err) {
      setMessage("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!settings.receive_newsletter}
          onChange={(e) => setSettings({ ...settings, receive_newsletter: e.target.checked })}
        />
        <span className="text-sm">Receive newsletter emails</span>
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!settings.dark_mode}
          onChange={(e) => {
            const next = { ...settings, dark_mode: e.target.checked };
            setSettings(next);
            // optimistic UI: apply immediately
            try {
              if (next.dark_mode) {
                document.documentElement.classList.add("dark");
                localStorage.setItem(THEME_KEY, "dark");
              } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem(THEME_KEY, "light");
              }
            } catch {
              /* ignore */
            }
          }}
        />
        <span className="text-sm">Enable dark mode</span>
      </label>

      <div>
        <button onClick={handleSave} className="rounded-md bg-bay-teal px-4 py-2 text-sm font-semibold text-white" disabled={loading}>
          {loading ? "Saving…" : "Save settings"}
        </button>
      </div>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
