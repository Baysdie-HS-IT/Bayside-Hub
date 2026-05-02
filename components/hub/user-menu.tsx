"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id?: string;
  email?: string | null;
  user_metadata?: Record<string, any> | null;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserMenu({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "User";
  const email = user?.email || null;

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      // redirect to home
      if (typeof window !== "undefined") window.location.href = "/";
    }
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-3 rounded-md px-3 py-1 hover:bg-slate-50 transition-all"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="avatar" className="h-8 w-8 rounded-full object-cover transition-all" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700 transition-all">
            {initialsFromName(displayName)}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-bay-navy">{displayName}</div>
          {email ? <div className="text-xs text-slate-500">{email}</div> : null}
        </div>
        <svg className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transform transition-all ${
          open ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-95"
        }`}
        role="menu"
        aria-hidden={!open}
      >
        <div className="py-1">
          <a href="/hub/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">
            Profile
          </a>
          <a href="/hub/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">
            Settings
          </a>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
