"use client";

import { useEffect, useState } from "react";
import { HubNav } from "./hub-nav";

const STORAGE_KEY = "bayside.sidebar.collapsed";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setCollapsed(raw === "true");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  return (
    <div className={`flex flex-col ${collapsed ? "items-center" : ""}`}>
      <div className={`mb-3 w-full ${collapsed ? "px-0" : "px-2"}`}>
        <div className="flex items-center justify-between gap-3 px-2">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="h-10 w-10 rounded-md bg-bay-navy/10" />
            {!collapsed ? (
              <div>
                <p className="text-sm font-semibold text-bay-navy">Bayside</p>
                <p className="text-xs text-slate-500">Hub</p>
              </div>
            ) : null}
          </div>
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((s) => !s)}
            className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {collapsed ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
            </svg>
          </button>
        </div>
      </div>

      <div className={`w-full ${collapsed ? "max-w-[64px]" : ""}`}>
        <HubNav collapsed={collapsed} />
      </div>
    </div>
  );
}
