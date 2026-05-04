"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/hub/user-menu";
import { getHubSectionTheme } from "@/components/hub/section-theme";

type User = {
  id?: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
} | null;

type HubHeaderProps = Readonly<{
  user: User;
}>;

export function HubHeader({ user }: HubHeaderProps) {
  const pathname = usePathname() ?? "/hub";
  const theme = getHubSectionTheme(pathname);

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="shell-container py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Bayside Hub</p>
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${theme.headerChipClassName}`}>
                {theme.label}
              </span>
            </div>
            <p className={`mt-1 text-lg font-bold tracking-tight ${theme.titleClassName}`}>School Operations Portal</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="hidden rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-bay-teal hover:text-bay-teal sm:block"
              href="/"
            >
              Back to landing
            </Link>
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link href="/login" className="rounded-md bg-bay-teal px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-bay-teal/90">
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
