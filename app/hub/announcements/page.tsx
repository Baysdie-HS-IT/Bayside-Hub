import { HubPageShell, SurfaceCard, Badge } from "@/components/hub/page-shell";

const announcements = [
  {
    title: "Campus Wi-Fi maintenance complete",
    scope: "Global",
    author: "IT Operations",
    published: "Today · 8:10 AM",
    summary: "Network stability restored and monitoring thresholds updated."
  },
  {
    title: "Robotics room change for this week",
    scope: "Club",
    author: "Robotics Collective",
    published: "Yesterday · 3:25 PM",
    summary: "Meetings move to Innovation Lab B while Workshop A is serviced."
  },
  {
    title: "Policy brief rubric clarification",
    scope: "Class",
    author: "Modern Civics",
    published: "Yesterday · 10:40 AM",
    summary: "Added examples for evidence weighting and citation format."
  }
] as const;

const checklist = [
  "Confirm scope and recipients before publishing.",
  "Use concise titles with specific action context.",
  "Attach links to detailed resources where available."
] as const;

export default function AnnouncementsPage() {
  return (
    <HubPageShell
      eyebrow="Communication"
      title="Announcements"
      description="Publish timely updates with clear scope control for global, club, and class audiences."
      stats={[
        { label: "Published this week", value: "18", detail: "11 global, 5 class, 2 club" },
        { label: "Unread high priority", value: "2", detail: "Action needed before Friday" },
        { label: "Drafts in review", value: "4", detail: "Awaiting approval or scheduling" },
        { label: "Avg read time", value: "2.4m", detail: "Across all announcement views" }
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <SurfaceCard title="Latest updates" description="Recently published announcements across all scopes.">
          <ul className="space-y-3">
            {announcements.map((item) => (
              <li className="rounded-xl border border-slate-200 p-4" key={item.title}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-bay-navy">{item.title}</h2>
                  <Badge tone={item.scope === "Global" ? "info" : "neutral"}>{item.scope}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {item.author} · {item.published}
                </p>
                <p className="mt-2 text-sm text-slate-700">{item.summary}</p>
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard title="Publishing quality checklist" description="Guidelines that keep messaging clear and reliable.">
          <ol className="space-y-3 text-sm text-slate-700">
            {checklist.map((item) => (
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" key={item}>
                {item}
              </li>
            ))}
          </ol>
        </SurfaceCard>
      </div>
    </HubPageShell>
  );
}
