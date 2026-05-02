"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  function client() {
    if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase not configured");
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supa = client();
      const { error } = await supa.auth.signInWithOtp({ email });
      if (error) setMessage(error.message);
      else setMessage("Check your email for a sign-in link.");
    } catch (err) {
      setMessage("Failed to send sign-in link.");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithProvider(provider: "google" | "github" | "apple") {
    setLoading(true);
    setMessage(null);
    try {
      const supa = client();
      const redirectTo = typeof window !== "undefined" ? window.location.origin + "/hub" : undefined;
      const callback = typeof window !== "undefined" ? window.location.origin + "/auth/callback" : redirectTo;
      const { error } = await supa.auth.signInWithOAuth({ provider, options: { redirectTo: callback } });
      if (error) setMessage(error.message);
      // Note: on success Supabase will redirect the browser to the provider consent flow.
    } catch (err) {
      setMessage("Failed to start OAuth flow.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm text-slate-700">Email address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </label>
        <div>
          <button
            type="submit"
            className="rounded-md bg-bay-teal px-4 py-2 text-sm font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Sending…" : "Send sign-in link"}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3">
        <span className="flex-1 border-t border-slate-200" />
        <span className="text-xs text-slate-400">Or continue with</span>
        <span className="flex-1 border-t border-slate-200" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => signInWithProvider("google")}
          className="flex items-center justify-center gap-2 rounded-md border px-2 py-2 text-sm font-medium hover:bg-slate-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M21.35 11.1h-9.2v2.9h5.4c-.25 1.5-1.17 2.8-2.5 3.66v3.05h4.04c2.37-2.19 3.73-5.4 3.73-9.3 0-.63-.06-1.25-.21-1.91z" />
            <path d="M12.15 22c2.7 0 4.96-.9 6.62-2.45l-3.98-3.05c-1.06.73-2.42 1.15-3.99 1.15-3.08 0-5.69-2.08-6.62-4.9H1.9v3.09C3.56 19.9 7.6 22 12.15 22z" />
            <path d="M5.53 13.74a7.48 7.48 0 010-3.48V7.17H1.9a11 11 0 000 9.66l3.63-3.09z" />
            <path d="M12.15 6.6c1.47 0 2.78.5 3.8 1.47l2.85-2.85C17.07 3.38 14.81 2.5 12.15 2.5 7.6 2.5 3.56 4.6 1.9 7.91l3.63 3.09c.93-2.82 3.54-4.9 6.62-4.9z" />
          </svg>
        </button>

        <button
          onClick={() => signInWithProvider("github")}
          className="flex items-center justify-center gap-2 rounded-md border px-2 py-2 text-sm font-medium hover:bg-slate-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.16 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.2-3.37-1.2-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1.01.07 1.54 1.04 1.54 1.04.9 1.54 2.36 1.09 2.94.83.09-.64.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85.004 1.71.114 2.51.334 1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.72 0 .27.18.58.69.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z" />
          </svg>
        </button>

        <button
          onClick={() => signInWithProvider("apple")}
          className="flex items-center justify-center gap-2 rounded-md border px-2 py-2 text-sm font-medium hover:bg-slate-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16.365 1.43c0 1.14-.42 2.08-1.3 2.86-.86.76-2.06 1.32-3.42 1.12-.06-.47-.09-.95.02-1.43.12-.5.36-.98.68-1.42.71-1 1.88-1.8 3.02-2.13.3-.09.62-.14.93-.14.02 0 .03 0 .03.01zM12.7 6.3c1.8 0 3.34.86 4.28 2.21.3.41.5.87.6 1.36.22.95-.06 2.03-.83 3.12-.66.9-1.68 1.85-2.98 1.85-1.3 0-1.7-.66-2.9-.66-1.21 0-1.77.66-2.97.66-1.3 0-2.33-.95-2.99-1.85C2.3 12.8 2 11.72 2.22 10.77c.1-.49.3-.95.6-1.36C4.06 6.86 5.6 6.3 7.4 6.3c1.06 0 2.04.52 2.9.52.85 0 1.83-.52 2.4-.52z" />
          </svg>
        </button>
      </div>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
