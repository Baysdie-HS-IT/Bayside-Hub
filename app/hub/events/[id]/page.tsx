import { createSupabaseRouteClient } from "@/lib/supabase/auth";
import EventDetail from "@/components/events/event-detail";
import { HubPageShell } from "@/components/hub/page-shell";

export default async function EventPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseRouteClient();
  const { data: event, error } = await supabase.from("events").select("*").eq("id", params.id).single();
  if (error || !event) {
    return (
      <HubPageShell eyebrow="Events" title="Event not found" description="The requested event could not be located.">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Check the event URL or return to the events list.</div>
      </HubPageShell>
    );
  }

  return (
    <HubPageShell eyebrow="Events" title="Event details" description="Review schedule, registrations, and organizer actions for this event.">
      <EventDetail event={event} />
    </HubPageShell>
  );
}
