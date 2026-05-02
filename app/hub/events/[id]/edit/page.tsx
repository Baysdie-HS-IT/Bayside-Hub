import { createSupabaseRouteClient } from "@/lib/supabase/auth";
import EventForm from "@/components/events/event-form";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseRouteClient();
  const { data: event, error } = await supabase.from("events").select("*").eq("id", params.id).single();

  if (error || !event) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Event not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit event</h1>
      <EventForm eventId={params.id} initialData={event} />
    </div>
  );
}
