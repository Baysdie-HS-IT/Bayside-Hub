"use client";

import { useEffect, useState } from "react";

function googleCalendarUrl(event: any) {
  const start = encodeURIComponent(new Date(event.starts_at).toISOString());
  const end = encodeURIComponent(event.ends_at ? new Date(event.ends_at).toISOString() : new Date(event.starts_at).toISOString());
  const text = encodeURIComponent(event.title || "");
  const details = encodeURIComponent(event.description || "");
  const location = encodeURIComponent(event.location || "");
  return `https://calendar.google.com/calendar/r/eventedit?text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export default function EventDetail({ event }: { event: any }) {
  const [registrations, setRegistrations] = useState<any[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const evt: any = event as any;

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/events/${event.id}/registrations`);
      const data = await res.json();
      if (res.ok) {
        setRegistrations(data.registrations ?? null);
        setCount(data.count ?? (data.registrations?.length ?? 0));
      } else {
        setCount(data.count ?? 0);
      }

      // fetch current user to determine owner/admin
      try {
        const me = await fetch('/api/auth/me');
        if (me.ok) {
          const jm = await me.json();
          const uid = jm.user?.id;
          const role = jm.user?.user_metadata?.role;
          setIsOwner(uid && evt && evt.created_by === uid);
          setIsAdmin(role === 'admin');
        }
      } catch {
        // ignore
      }
    }
    load();
  }, [event.id]);

  const freeSlots = event.capacity ? Math.max(0, event.capacity - (count ?? 0)) : null;

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{new Date(event.starts_at).toLocaleString()} {event.location ? `· ${event.location}` : null}</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/api/events/${event.id}/ical`} className="rounded border px-3 py-1 text-sm">Download iCal</a>
          <a href={googleCalendarUrl(event)} target="_blank" rel="noreferrer" className="rounded border px-3 py-1 text-sm">Add to Google Calendar</a>
          <a href={`/api/events/${event.id}/export`} className="rounded border px-3 py-1 text-sm">Export CSV</a>
          {isOwner || isAdmin ? (
            <>
              <a href={`/hub/events/${event.id}/edit`} className="rounded border px-3 py-1 text-sm">Edit</a>
              <button onClick={async ()=>{
                if (!confirm('Delete this event?')) return;
                const res = await fetch(`/api/events/${event.id}`, { method: 'DELETE' });
                if (res.ok) location.href = '/hub/events';
                else alert('Delete failed');
              }} className="rounded border px-3 py-1 text-sm text-red-600">Delete</button>
            </>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-700">{event.description}</p>

      <div className="mt-6">
        <h3 className="text-sm font-semibold">Attendees</h3>
        {registrations === null ? (
          <p className="mt-2 text-sm text-slate-600">{count !== null ? `Registered: ${count}` : 'Loading...'}</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {registrations.map((r:any) => (
              <li key={r.id} className="rounded border px-3 py-2">{r.attendee_name} — {r.attendee_email}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
