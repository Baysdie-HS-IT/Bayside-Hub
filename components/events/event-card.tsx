"use client";

import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";

export default function EventCard({ event }: { event: any }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [registeredCount, setRegisteredCount] = useState<number | null>(null);

  async function handleRegister() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/events/${event.id}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || "Failed to register");
      else setMsg("Registered — check your email if applicable");
    } catch (err) {
      setMsg("Failed to register");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    async function loadCount() {
      try {
        const res = await fetch(`/api/events/${event.id}/registrations`);
        const data = await res.json();
        if (!mounted) return;
        if (data.count !== undefined) setRegisteredCount(data.count);
        else if (Array.isArray(data.registrations)) setRegisteredCount(data.registrations.length);
      } catch {
        // ignore
      }
    }
    loadCount();
    return () => { mounted = false; };
  }, [event.id]);

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-bay-navy">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{new Date(event.starts_at).toLocaleString()}</p>
          {event.location ? <p className="mt-1 text-sm text-slate-600">{event.location}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link href={`/hub/events/${event.id}`} className="text-sm text-slate-600">Details</Link>
          <button onClick={handleRegister} disabled={loading || (event.capacity && registeredCount !== null && registeredCount >= event.capacity)} className="rounded-md bg-bay-teal px-3 py-1 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? "…" : (event.capacity && registeredCount !== null && registeredCount >= event.capacity ? "Full" : "RSVP")}
          </button>
        </div>
      </div>
      {msg ? <p className="mt-2 text-sm text-slate-600">{msg}</p> : null}
    </div>
  );
}
