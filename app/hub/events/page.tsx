import { HubPageShell, SurfaceCard, Badge } from "@/components/hub/page-shell";

const timeline = [
  {
    title: "College Planning Night",
    when: "May 6 · 6:30 PM",
    location: "Main Hall",
    scope: "Schoolwide",
    note: "Counseling team and alumni panel."
  },
  {
    title: "STEM Expo",
    when: "May 9 · 4:00 PM",
    location: "Innovation Lab",
    scope: "Schoolwide",
    note: "Project demos and mentor judging."
  },
  {
    title: "Arts Guild Gallery Walk",
    when: "May 11 · 5:15 PM",
    location: "North Atrium",
    scope: "Club",
    note: "Student-curated spring portfolio showcase."
  },
  {
    title: "Track & Field Invitational",
    when: "May 14 · 10:00 AM",
    location: "Athletics Complex",
    scope: "Athletics",
    note: "Regional schools attending."
  }
] as const;

const planningNotes = [
  "AV support requested for three upcoming events.",
  "Parent volunteer coverage at 92% for this month.",
  "Transportation finalized for the invitational."
] as const;

export default function EventsPage() {
  return (
    <HubPageShell
      eyebrow="Calendar"
      title="Events"
      description="Track campus events with clear scheduling, ownership, and delivery readiness."
      stats={[
        { label: "Upcoming events", value: "9", detail: "4 this week, 5 next week" },
        { label: "Registered attendees", value: "648", detail: "Across all open registrations" },
        { label: "Venue utilization", value: "78%", detail: "Main venues through month-end" },
        { label: "Planning blockers", value: "2", detail: "Pending AV and transport confirmations" }
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <SurfaceCard title="Upcoming timeline" description="Scheduled events and delivery context.">
          <ol className="space-y-3">
            {timeline.map((event) => (
              <li className="rounded-xl border border-slate-200 p-4" key={event.title}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-bay-navy">{event.title}</h2>
                  <Badge tone={event.scope === "Schoolwide" ? "info" : "neutral"}>{event.scope}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{event.when}</p>
                <p className="mt-1 text-sm text-slate-600">{event.location}</p>
                <p className="mt-2 text-sm text-slate-700">{event.note}</p>
              </li>
            ))}
          </ol>
        </SurfaceCard>

        <SurfaceCard title="Planning notes" description="Operational updates tied to near-term events.">
          <ul className="space-y-3">
            {planningNotes.map((note) => (
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700" key={note}>
                {note}
              </li>
            ))}
          </ul>
        </SurfaceCard>
      </div>
    </HubPageShell>
  );
}
