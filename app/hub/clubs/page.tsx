import { HubPageShell, SurfaceCard, Badge } from "@/components/hub/page-shell";

const clubs = [
  {
    name: "Robotics Collective",
    advisor: "Ms. Alvarez",
    cadence: "Wednesday · 3:45 PM",
    members: "42 members",
    update: "Prototype showcase in 10 days"
  },
  {
    name: "Debate Society",
    advisor: "Mr. Hsu",
    cadence: "Tuesday · 4:00 PM",
    members: "28 members",
    update: "Regional prep sessions underway"
  },
  {
    name: "Arts Guild",
    advisor: "Ms. Brooks",
    cadence: "Thursday · 3:30 PM",
    members: "35 members",
    update: "Gallery walk scheduled next week"
  }
] as const;

const boardUpdates = [
  { title: "Budget requests", detail: "5 requests submitted; 3 approved", tone: "info" as const },
  { title: "Facility scheduling", detail: "2 room conflicts need resolution", tone: "warning" as const },
  { title: "Advisor confirmations", detail: "All spring advisors confirmed", tone: "success" as const }
] as const;

export default function ClubsPage() {
  return (
    <HubPageShell
      eyebrow="Activities"
      title="Clubs"
      description="Coordinate student organizations with clear visibility across meetings, membership, and advisor support."
      stats={[
        { label: "Active clubs", value: "14", detail: "Across arts, STEM, and service" },
        { label: "Total members", value: "312", detail: "Average 22 per club" },
        { label: "This week meetings", value: "11", detail: "2 schoolwide showcases" },
        { label: "Open board actions", value: "7", detail: "Budget and scheduling items" }
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <SurfaceCard title="Featured organizations" description="Current club momentum and upcoming milestones.">
          <ul className="space-y-3">
            {clubs.map((club) => (
              <li className="rounded-xl border border-slate-200 p-4" key={club.name}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-bay-navy">{club.name}</h2>
                  <Badge tone="info">{club.members}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{club.advisor}</p>
                <p className="mt-2 text-sm text-slate-600">{club.cadence}</p>
                <p className="mt-2 text-sm text-slate-700">{club.update}</p>
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard title="Board operations" description="Current updates from board and advisor workflows.">
          <ul className="space-y-3">
            {boardUpdates.map((update) => (
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" key={update.title}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-bay-navy">{update.title}</p>
                  <Badge tone={update.tone}>{update.tone}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{update.detail}</p>
              </li>
            ))}
          </ul>
        </SurfaceCard>
      </div>
    </HubPageShell>
  );
}
