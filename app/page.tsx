import Link from "next/link";
import { quickAccessItems, roles } from "@/lib/auth/roles";

const mainNav = [
  { label: "Academics", href: "#academics" },
  { label: "Student Activities", href: "#activities" },
  { label: "Operations", href: "#operations" },
  { label: "Community", href: "#community" }
] as const;

const highlights = [
  {
    title: "Role-aware daily dashboard",
    detail: "Students, teachers, staff, and admins each get focused workflows from the same platform."
  },
  {
    title: "Integrated events and announcements",
    detail: "Communication, registration, and scheduling are all connected in one experience."
  },
  {
    title: "Classroom and operations coordination",
    detail: "From assignments to rosters to internal tools, Bayside workflows stay in sync."
  }
] as const;

const features = [
  {
    title: "Role-based navigation",
    detail: "Quick access and sidebar links adapt to each role profile without duplicating pages."
  },
  {
    title: "Event operations toolkit",
    detail: "Registration, iCal export, Google Calendar links, attendee export, and owner controls."
  },
  {
    title: "School-specific page identity",
    detail: "Each hub section has distinct navigation accents while preserving one cohesive Bayside design system."
  }
] as const;

const roleDescriptions: Record<(typeof roles)[number], string> = {
  student: "Coursework, clubs, events, and school announcements in one student-ready workspace.",
  teacher: "Instruction delivery, rosters, assignment visibility, and class communication tools.",
  staff: "Operational tools, event logistics, and internal updates for support teams.",
  admin: "Full control over platform modules, access layers, and school-wide configuration."
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-bay-ink">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="shell-container flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bay-teal">Bayside High School</p>
            <Link className="mt-1 block text-2xl font-black tracking-tight text-bay-navy" href="/">
              Bayside Hub
            </Link>
          </div>
          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-700">
            {mainNav.map((item) => (
              <Link className="transition hover:text-bay-navy" href={item.href} key={item.label}>
                {item.label}
              </Link>
            ))}
            <Link className="rounded-full bg-bay-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-bay-ink" href="/hub">
              Open Hub
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-r from-bay-navy via-bay-ink to-bay-navy text-white">
          <div className="shell-container grid gap-8 py-12 md:py-16 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bay-gold">Bayside Digital Campus</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Built for Bayside. Designed for every school day.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100 sm:text-base">
                A complete school operations platform connecting academics, activities, and internal coordination with a clear Bayside-first interface.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link className="rounded-md bg-bay-gold px-5 py-2.5 text-sm font-semibold text-bay-ink transition hover:opacity-90" href="/hub">
                  Launch dashboard
                </Link>
                <Link className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10" href="/login">
                  Sign in
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
              <h2 className="text-lg font-bold">Today at a glance</h2>
              <dl className="mt-4 space-y-4">
                <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                  <dt className="text-xs uppercase tracking-wide text-slate-200">Active classes</dt>
                  <dd className="mt-1 text-2xl font-black">24</dd>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                  <dt className="text-xs uppercase tracking-wide text-slate-200">Upcoming events</dt>
                  <dd className="mt-1 text-2xl font-black">9</dd>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                  <dt className="text-xs uppercase tracking-wide text-slate-200">Priority announcements</dt>
                  <dd className="mt-1 text-2xl font-black">7</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="shell-container py-10" id="operations">
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={item.title}>
                <h2 className="text-lg font-bold tracking-tight text-bay-navy">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="shell-container pb-10" id="academics">
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-bay-navy">Core modules</h2>
                <p className="mt-2 text-sm text-slate-600">Jump directly into the most-used areas of the Bayside Hub.</p>
              </div>
              <Link className="text-sm font-semibold text-bay-teal hover:underline" href="/hub">
                View all modules
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {quickAccessItems.map((item) => (
                <Link
                  className="rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-bay-teal hover:text-bay-teal"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="shell-container pb-10" id="activities">
          <div className="grid gap-4 lg:grid-cols-3">
            {features.map((feature) => (
              <article className="rounded-xl border border-slate-200 bg-white p-6" key={feature.title}>
                <h2 className="text-lg font-bold tracking-tight text-bay-navy">{feature.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="shell-container pb-14" id="community">
          <h2 className="text-2xl font-black tracking-tight text-bay-navy">Choose your role</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">Every role gets a distinct starting context in the same Bayside ecosystem.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {roles.map((role) => (
              <Link className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-bay-teal" href={`/hub?role=${role}`} key={role}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-bay-teal">{role}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{roleDescriptions[role]}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="shell-container grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bay-teal">Bayside Hub</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
              A school-first platform for connected learning, communication, and operational coordination.
            </p>
          </div>
          <section>
            <h2 className="text-sm font-semibold text-bay-navy">Platform</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <Link className="block transition hover:text-bay-teal" href="/hub/classes">
                Classes
              </Link>
              <Link className="block transition hover:text-bay-teal" href="/hub/events">
                Events
              </Link>
              <Link className="block transition hover:text-bay-teal" href="/hub/announcements">
                Announcements
              </Link>
            </div>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-bay-navy">Account</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <Link className="block transition hover:text-bay-teal" href="/login">
                Sign in
              </Link>
              <Link className="block transition hover:text-bay-teal" href="/hub/profile">
                Profile
              </Link>
              <Link className="block transition hover:text-bay-teal" href="/hub/settings">
                Settings
              </Link>
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
}
