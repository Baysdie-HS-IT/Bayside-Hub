import { HubPageShell, SurfaceCard, Badge } from "@/components/hub/page-shell";

const assignments = [
  {
    course: "AP Literature",
    task: "Comparative essay outline",
    due: "Friday · 11:59 PM",
    status: "Needs review",
    tone: "warning" as const
  },
  {
    course: "Calculus II",
    task: "Integration problem set",
    due: "Tomorrow · 5:00 PM",
    status: "On track",
    tone: "success" as const
  },
  {
    course: "Modern Civics",
    task: "Policy brief draft",
    due: "Monday · 8:00 AM",
    status: "Planning",
    tone: "info" as const
  },
  {
    course: "Physics Lab",
    task: "Motion analysis report",
    due: "Tuesday · 3:30 PM",
    status: "Pending start",
    tone: "neutral" as const
  }
] as const;

const insights = [
  "Most active submission window: 7:00 PM–9:00 PM.",
  "Late-turn-in rate dropped 14% since pacing reminders were enabled.",
  "Group assignments currently represent 22% of open workload."
] as const;

export default function AssignmentsPage() {
  return (
    <HubPageShell
      eyebrow="Academics"
      title="Assignments"
      description="A structured workload view for deadlines, pacing, and completion quality."
      stats={[
        { label: "Open tasks", value: "38", detail: "12 due within 48 hours" },
        { label: "Avg completion", value: "86%", detail: "Across current courses" },
        { label: "Late risk", value: "4", detail: "Assignments flagged high risk" },
        { label: "Submitted today", value: "17", detail: "9 awaiting teacher review" }
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SurfaceCard title="Priority queue" description="Assignments ordered by urgency and readiness.">
          <ul className="space-y-3">
            {assignments.map((item) => (
              <li className="rounded-xl border border-slate-200 p-4" key={`${item.course}-${item.task}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.course}</p>
                    <p className="mt-1 text-base font-semibold text-bay-navy">{item.task}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.due}</p>
                  </div>
                  <Badge tone={item.tone}>{item.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard title="Workload insights" description="Quick guidance for balancing upcoming commitments.">
          <ul className="space-y-3 text-sm text-slate-700">
            {insights.map((insight) => (
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" key={insight}>
                {insight}
              </li>
            ))}
          </ul>
        </SurfaceCard>
      </div>
    </HubPageShell>
  );
}
