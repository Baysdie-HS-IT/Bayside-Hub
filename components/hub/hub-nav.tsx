import Link from "next/link";
import { quickAccessItems } from "@/lib/auth/roles";

const navItems = [{ label: "Dashboard", href: "/hub" }, ...quickAccessItems] as const;

export function HubNav() {
  return (
    <nav aria-label="Hub navigation" className="mt-5">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Link
            className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-bay-teal hover:text-bay-teal"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
