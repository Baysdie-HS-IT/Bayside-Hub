import Link from "next/link";
import type { ReactNode } from "react";
import { HubNav } from "@/components/hub/hub-nav";

type HubLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function HubLayout({ children }: HubLayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="shell-container py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bay-teal">Bayside Hub</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-bay-navy">School Operations Portal</p>
            </div>
            <Link
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-bay-teal hover:text-bay-teal"
              href="/"
            >
              Back to landing
            </Link>
          </div>
          <HubNav />
        </div>
      </header>

      <div className="shell-container py-8 sm:py-10">{children}</div>
    </div>
  );
}
