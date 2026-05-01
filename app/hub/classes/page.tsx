import { HubPageShell, SurfaceCard, Badge } from "@/components/hub/page-shell";

const courses = [
  {
    name: "AP Literature",
    instructor: "Ms. Jordan",
    room: "B-214",
    cadence: "Mon/Wed/Fri · 9:10 AM",
    progress: "89%",
    note: "Essay workshop this Friday"
  },
  {
    name: "Calculus II",
    instructor: "Mr. Malik",
    room: "A-307",
    cadence: "Daily · 10:20 AM",
    progress: "84%",
    note: "Quiz corrections close tomorrow"
  },
  {
    name: "Modern Civics",
    instructor: "Dr. Kim",
    room: "C-118",
    cadence: "Tue/Thu · 1:05 PM",
    progress: "92%",
    note: "Debate prep packets posted"
  }
] as const;

const officeHours = [
  { teacher: "Ms. Jordan", slot: "Tuesday · 3:15 PM", mode: "In person" },
  { teacher: "Mr. Malik", slot: "Wednesday · 7:45 AM", mode: "Virtual" },
  { teacher: "Dr. Kim", slot: "Thursday · 3:30 PM", mode: "In person" }
] as const;

export default function ClassesPage() {
  return (
    <HubPageShell
      eyebrow="Academics"
      title="Classes"
      description="Track class rhythm, monitor performance, and keep coursework moving with clear daily visibility."
      stats={[
        { label: "Current courses", value: "6", detail: "Across core and enrichment tracks" },
        { label: "Average standing", value: "A-", detail: "Strong momentum this term" },
        { label: "Attendance trend", value: "97%", detail: "Up 1.2% from last month" },
        { label: "Office hours this week", value: "12", detail: "6 in person, 6 virtual" }
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <SurfaceCard title="Course lineup" description="Current focus areas and near-term milestones.">
          <ul className="space-y-3">
            {courses.map((course) => (
              <li className="rounded-xl border border-slate-200 p-4" key={course.name}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-bay-navy">{course.name}</h2>
                  <Badge tone="info">{course.progress} complete</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{course.instructor}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {course.room} · {course.cadence}
                </p>
                <p className="mt-2 text-sm text-slate-700">{course.note}</p>
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard title="Support windows" description="Upcoming office hours and check-in opportunities.">
          <ul className="space-y-3">
            {officeHours.map((slot) => (
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" key={`${slot.teacher}-${slot.slot}`}>
                <p className="text-sm font-semibold text-bay-navy">{slot.teacher}</p>
                <p className="mt-1 text-sm text-slate-600">{slot.slot}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{slot.mode}</p>
              </li>
            ))}
          </ul>
        </SurfaceCard>
      </div>
    </HubPageShell>
  );
}
