"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type ThemeOption = "light" | "dark" | "system";

type Settings = {
  receive_newsletter?: boolean;
  theme?: ThemeOption;
  [key: string]: any;
};

export default function SettingsForm({ initialSettings }: { initialSettings?: Settings }) {
  const normalized: Settings = {
    receive_newsletter: true,
    theme: "system",
    ...initialSettings
  };

  // Backwards compatibility: support old `dark_mode` boolean
  if (normalized.theme === undefined && (normalized as any).dark_mode !== undefined) {
    normalized.theme = (normalized as any).dark_mode ? "dark" : "light";
  }

  const [settings, setSettings] = useState<Settings>(normalized);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // local theme key to persist optimistic changes quickly
  const THEME_KEY = "bayside.theme";

  useEffect(() => {
    // apply theme on mount: prefer localStorage, then user settings
    try {
      const stored = localStorage.getItem(THEME_KEY);
      const theme = stored || settings.theme || "system";
      applyTheme(theme as ThemeOption);
    } catch {
      applyTheme((settings.theme as ThemeOption) || "system");
    }
  }, []);

  function applyTheme(theme: ThemeOption) {
    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem(THEME_KEY, "dark");
      } else if (theme === "light") {
        document.documentElement.classList.remove("dark");
        localStorage.setItem(THEME_KEY, "light");
      } else {
        // system
        try {
          localStorage.setItem(THEME_KEY, "system");
        } catch {}
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      // add a short transition class for smooth fade
      document.documentElement.classList.add("theme-transition");
      window.setTimeout(() => document.documentElement.classList.remove("theme-transition"), 300);
    } catch {
      // ignore
    }
  }

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
      // also set server cookie so SSR can read the theme immediately
      try {
        await fetch("/api/auth/set-theme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ theme: settings.theme ?? "system" }) });
      } catch {}
    } catch (err) {
      setMessage("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  }

  // matchMedia listener to follow system when theme === 'system'
  useEffect(() => {
    if (settings.theme !== "system") return;
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      applyTheme("system");
    };
    m.addEventListener?.("change", handler);
    return () => m.removeEventListener?.("change", handler);
  }, [settings.theme]);

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

      <div>
        <div className="text-sm font-medium">Theme</div>
        <div className="mt-2 flex gap-2">
          <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-slate-50">
            <input
              type="radio"
              name="theme"
              value="system"
              checked={settings.theme === "system"}
              onChange={() => {
                setSettings({ ...settings, theme: "system" });
                applyTheme("system");
              }}
            />
            <span className="text-sm">System</span>
          </label>

          <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-slate-50">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={settings.theme === "light"}
              onChange={() => {
                setSettings({ ...settings, theme: "light" });
                applyTheme("light");
              }}
            />
            <span className="text-sm">Light</span>
          </label>

          <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-slate-50">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={settings.theme === "dark"}
              onChange={() => {
                setSettings({ ...settings, theme: "dark" });
                applyTheme("dark");
              }}
            />
            <span className="text-sm">Dark</span>
          </label>
        </div>
      </div>

      <div>
        <button onClick={handleSave} className="rounded-md bg-bay-teal px-4 py-2 text-sm font-semibold text-white" disabled={loading}>
          {loading ? "Saving…" : "Save settings"}
        </button>
      </div>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
