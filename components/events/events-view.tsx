"use client";

import { useEffect, useState } from "react";
import Calendar from "./calendar";
import EventCard from "./event-card";

export default function EventsView() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    try {
      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      setEvents(data.events ?? []);
      // gather tags from events
      const seen = new Set<string>();
      (data.events ?? []).forEach((e:any) => { if (Array.isArray(e.tags)) e.tags.forEach((t:string) => seen.add(t)); });
      setTags(Array.from(seen));
    } catch (err) {
      // ignore
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [search, tag]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search events" className="rounded border px-3 py-1" />
          <select value={tag ?? ""} onChange={(e)=>setTag(e.target.value || null)} className="rounded border px-3 py-1">
            <option value="">All tags</option>
            {tags.map((t)=> <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={() => { setSearch(''); setTag(null); }} className="rounded border px-3 py-1">Clear</button>
        </div>
        <div className="text-sm text-slate-600">{loading ? 'Loading…' : `${events.length} events`}</div>
      </div>

      <div className="mb-6">
        <Calendar events={events} />
      </div>

      <div className="space-y-3">
        {events.map((ev:any)=> <EventCard key={ev.id} event={ev} />)}
      </div>
    </div>
  );
}
