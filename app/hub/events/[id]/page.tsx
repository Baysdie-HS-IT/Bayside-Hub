import { createSupabaseRouteClient } from "@/lib/supabase/auth";
import EventDetail from "@/components/events/event-detail";

export default async function EventPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseRouteClient();
  const { data: event, error } = await supabase.from("events").select("*").eq("id", params.id).single();
  if (error || !event) return <div className="p-6">Event not found</div>;

  return (
    <div className="p-6">
      <EventDetail event={event} />
    </div>
  );
}
