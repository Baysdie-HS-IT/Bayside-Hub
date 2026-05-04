import { createSupabaseRouteClient } from "@/lib/supabase/auth";
import EventForm from "@/components/events/event-form";
import { HubPageShell } from "@/components/hub/page-shell";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseRouteClient();
  const { data: event, error } = await supabase.from("events").select("*").eq("id", params.id).single();

  if (error || !event) {
    return (
      <HubPageShell eyebrow="Events" title="Event not found" description="This event could not be loaded for editing.">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Return to the events list and select another event.</div>
      </HubPageShell>
    );
  }

  return (
    <HubPageShell eyebrow="Events" title="Edit event" description="Update timing, capacity, and details for this event.">
      <div className="max-w-2xl">
        <EventForm eventId={params.id} initialData={event} />
      </div>
    </HubPageShell>
  );
}
