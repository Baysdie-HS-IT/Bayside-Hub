import { HubPageShell, SurfaceCard, Badge } from "@/components/hub/page-shell";

const sections = [
  {
    className: "Calculus II",
    instructor: "Mr. Malik",
    students: 28,
    attendance: "98%",
    alerts: "0 alerts"
  },
  {
    className: "Modern Civics",
    instructor: "Dr. Kim",
    students: 26,
    attendance: "95%",
    alerts: "2 alerts"
  },
  {
    className: "AP Literature",
    instructor: "Ms. Jordan",
    students: 31,
    attendance: "96%",
    alerts: "1 alert"
  }
] as const;

const interventions = [
  { student: "A. Rivera", reason: "Attendance trend dip", status: "Advisor follow-up pending", tone: "warning" as const },
  { student: "M. Chen", reason: "Missing assignment streak", status: "Family conference booked", tone: "info" as const },
  { student: "L. Patel", reason: "Positive turnaround", status: "Support plan complete", tone: "success" as const }
] as const;

export default function RostersPage() {
  return (
    <HubPageShell
      eyebrow="Faculty"
      title="Rosters"
      description="Monitor section-level enrollment, attendance, and intervention needs from a single view."
      stats={[
        { label: "Tracked students", value: "85", detail: "Across three active sections" },
        { label: "Average attendance", value: "96.3%", detail: "Rolling 14-day average" },
        { label: "Intervention cases", value: "3", detail: "2 currently active" },
        { label: "Family follow-ups", value: "5", detail: "Scheduled this week" }
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <SurfaceCard title="Section overview" description="Enrollment and attendance indicators by class section.">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600">Section</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Instructor</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Students</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Attendance</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr className="border-t border-slate-200" key={section.className}>
                    <td className="px-4 py-3 font-medium text-bay-navy">{section.className}</td>
                    <td className="px-4 py-3 text-slate-600">{section.instructor}</td>
                    <td className="px-4 py-3 text-slate-700">{section.students}</td>
                    <td className="px-4 py-3 text-slate-700">{section.attendance}</td>
                    <td className="px-4 py-3 text-slate-700">{section.alerts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Student interventions" description="Current intervention and support plan status.">
          <ul className="space-y-3">
            {interventions.map((item) => (
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" key={item.student}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-bay-navy">{item.student}</p>
                  <Badge tone={item.tone}>{item.tone}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.reason}</p>
                <p className="mt-1 text-sm text-slate-700">{item.status}</p>
              </li>
            ))}
          </ul>
        </SurfaceCard>
      </div>
    </HubPageShell>
  );
}
