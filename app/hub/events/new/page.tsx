import EventForm from "@/components/events/event-form";
import { HubPageShell } from "@/components/hub/page-shell";

export default function NewEventPage() {
  return (
    <HubPageShell eyebrow="Events" title="Create event" description="Create a new event for your club or organization.">
      <div className="max-w-2xl">
        <EventForm />
      </div>
    </HubPageShell>
  );
}
