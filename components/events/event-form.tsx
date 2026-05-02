"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EventFormProps {
  eventId?: string;
  initialData?: any;
}

export default function EventForm({ eventId, initialData }: EventFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [capacity, setCapacity] = useState(initialData?.capacity ?? "");
  const [tags, setTags] = useState(initialData?.tags ? initialData.tags.join(", ") : "");
  const [startsAt, setStartsAt] = useState(initialData?.starts_at?.slice(0, 16) ?? "");
  const [endsAt, setEndsAt] = useState(initialData?.ends_at?.slice(0, 16) ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        title,
        description,
        location: location || null,
        capacity: capacity ? parseInt(capacity) : null,
        tags: tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        starts_at: startsAt,
        ends_at: endsAt || null,
        status: "published"
      };

      const method = eventId ? "PATCH" : "POST";
      const url = eventId ? `/api/events/${eventId}` : `/api/events`;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) setMessage(data.error || "Failed to save event");
      else {
        setMessage(eventId ? "Event updated" : "Event created");
        setTimeout(() => router.push(eventId ? `/hub/events/${eventId}` : `/hub/events`), 500);
      }
    } catch (err) {
      setMessage("Failed to save event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <label className="block">
        <div className="text-sm font-semibold">Title *</div>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
      </label>

      <label className="block">
        <div className="text-sm font-semibold">Description</div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 min-h-[100px]" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label>
          <div className="text-sm font-semibold">Starts at *</div>
          <input required type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </label>
        <label>
          <div className="text-sm font-semibold">Ends at</div>
          <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </label>
      </div>

      <label className="block">
        <div className="text-sm font-semibold">Location</div>
        <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
      </label>

      <label className="block">
        <div className="text-sm font-semibold">Capacity (optional)</div>
        <input type="number" min="0" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Leave empty for unlimited" />
      </label>

      <label className="block">
        <div className="text-sm font-semibold">Tags (comma-separated)</div>
        <input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="e.g. athletics, academic, social" />
      </label>

      <div>
        <button className="rounded-md bg-bay-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={loading} type="submit">
          {loading ? "Saving…" : (eventId ? "Update event" : "Create event")}
        </button>
      </div>

      {message ? <p className={`text-sm ${message.includes("Error") || message.includes("Failed") ? "text-red-600" : "text-slate-600"}`}>{message}</p> : null}
    </form>
  );
}
