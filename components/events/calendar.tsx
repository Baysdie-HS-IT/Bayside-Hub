"use client";

import { useState } from "react";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export default function Calendar({ events }: { events: any[] }) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [view, setView] = useState<'month'|'week'>('month');
  const [popover, setPopover] = useState<{date: Date, events:any[]} | null>(null);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const startDay = monthStart.getDay();

  const monthDays: Array<{ date: Date; events: any[] }> = [];
  for (let i = 0; i < startDay; i++) monthDays.push({ date: new Date(monthStart.getFullYear(), monthStart.getMonth(), i - startDay + 1), events: [] });
  for (let d = 1; d <= monthEnd.getDate(); d++) {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), d);
    const dayEvents = events.filter((e) => {
      const starts = new Date(e.starts_at);
      return starts.getFullYear() === date.getFullYear() && starts.getMonth() === date.getMonth() && starts.getDate() === date.getDate();
    });
    monthDays.push({ date, events: dayEvents });
  }

  function prev() {
    setCursor((c) => view === 'month' ? new Date(c.getFullYear(), c.getMonth() - 1, 1) : new Date(c.getFullYear(), c.getMonth(), c.getDate() - 7));
  }
  function next() {
    setCursor((c) => view === 'month' ? new Date(c.getFullYear(), c.getMonth() + 1, 1) : new Date(c.getFullYear(), c.getMonth(), c.getDate() + 7));
  }

  function openCreate(date: Date) {
    const iso = date.toISOString().slice(0,10);
    window.location.href = `/hub/events/new?start=${iso}`;
  }

  if (view === 'week') {
    const startOfWeek = new Date(cursor);
    startOfWeek.setDate(cursor.getDate() - cursor.getDay());
    const days = Array.from({length:7}).map((_,i)=>{
      const date = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate()+i);
      const dayEvents = events.filter((e:any)=>{
        const s = new Date(e.starts_at);
        return s.getFullYear()===date.getFullYear() && s.getMonth()===date.getMonth() && s.getDate()===date.getDate();
      });
      return {date, events: dayEvents};
    });

    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Week of {startOfWeek.toLocaleDateString()}</div>
          <div className="flex gap-2">
            <button onClick={()=>setView('month')} className="rounded border px-2">Month</button>
            <button onClick={prev} className="rounded border px-2">‹</button>
            <button onClick={next} className="rounded border px-2">›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((cell, idx)=> (
            <div key={idx} className="min-h-[120px] rounded border p-2 bg-white relative">
              <div className="text-sm font-semibold">{cell.date.toLocaleDateString(undefined,{weekday:'short', month:'short', day:'numeric'})}</div>
              <div className="mt-2 space-y-1">
                {cell.events.map((e:any)=> (
                  <a key={e.id} href={`/hub/events/${e.id}`} className="block text-xs truncate rounded px-1 py-0.5 bg-bay-teal/10 text-bay-teal">{e.title}</a>
                ))}
              </div>
              <button onClick={()=>openCreate(cell.date)} className="absolute right-2 bottom-2 text-xs rounded border px-2">Create</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">{cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
        <div className="flex gap-2">
          <button onClick={()=>setView('week')} className="rounded border px-2">Week</button>
          <button onClick={prev} className="rounded border px-2">‹</button>
          <button onClick={next} className="rounded border px-2">›</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="text-xs font-medium text-slate-600">{d}</div>
        ))}
        {monthDays.map((cell, idx) => (
          <div key={idx} onClick={()=>setPopover({date: cell.date, events: cell.events})} className={`min-h-[80px] rounded border p-2 ${cell.date.getMonth() !== cursor.getMonth() ? "bg-slate-50 text-slate-400" : "bg-white"}`}>
            <div className="text-sm font-semibold">{cell.date.getDate()}</div>
            <div className="mt-1 space-y-1">
              {cell.events.slice(0,3).map((e:any) => (
                <a key={e.id} href={`/hub/events/${e.id}`} className="text-xs truncate rounded px-1 py-0.5 bg-bay-teal/10 text-bay-teal block">{e.title}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {popover ? (
        <div className="mt-3 rounded border bg-white p-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Events on {popover.date.toLocaleDateString()}</div>
            <div className="flex gap-2">
              <button onClick={()=>{ setPopover(null); }} className="rounded border px-2">Close</button>
              <button onClick={()=>openCreate(popover.date)} className="rounded border px-2">Create</button>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            {popover.events.length === 0 ? <div className="text-sm text-slate-600">No events</div> : popover.events.map((e:any)=> <a key={e.id} href={`/hub/events/${e.id}`} className="block rounded px-2 py-1 border">{e.title}</a>)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
