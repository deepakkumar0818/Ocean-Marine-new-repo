 "use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const sidebarTabs = [
  {
    key: "training",
    label: "Training",
    submodules: [
      { key: "training-plan", label: "Training Plan", href: "/qhse/training/create/plan" },
      { key: "training-record", label: "Training Record", href: "/qhse/training/create/record" },
    ],
  },
  {
    key: "drills",
    label: "Drills",
    submodules: [
      { key: "drill-plan", label: "Drill Plan", href: "/qhse/drills/create/plan" },
      { key: "drill-report", label: "Drill Report", href: "/qhse/drills/create/report" },
    ],
  },
  { key: "forms", label: "Forms & checklist" },
  { key: "defects", label: "Defects list",
    submodules: [
      { key: "defects-create", label: "Create defect", href: "/qhse/defects-list/create/plan" },
      { key: "defects-list", label: "Defects list", href: "/qhse/defects-list/create/list" },
    ],
  },
  { key: "best-practices", label: "Best practices" },
  { key: "near-miss", label: "Near-miss reporting", href: "/qhse/near-miss" },
  { key: "moc", label: "MOC" },
  {
    key: "due-diligence",
    label: "Due diligence / subcontractor audits",
  },
  {
    key: "audits",
    label: "Audits & inspection planner",
  },
  {
    key: "poac",
    label: "POAC cross competency",
  },
  { key: "kpi", label: "KPI" },
];

export default function QhsePage() {
  const [activeTab, setActiveTab] = useState("training"); // show Training first
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-transparent text-white flex">
      {/* Left Sidebar (same style as Operations/PMS) */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full bg-slate-900/98 border-r border-white/20 shadow-2xl backdrop-blur-md z-50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "280px" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Navigation</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
              aria-label="Close sidebar"
            >
              <span className="text-white text-lg">×</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {sidebarTabs.map((tab) => (
                <div key={tab.key} className="space-y-1">
                  {tab.href ? (
                    <Link
                      href={tab.href}
                      className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                        activeTab === tab.key
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40"
                          : "text-white/90 hover:bg-white/10 hover:text-white border border-white/5"
                      }`}
                    >
                      {tab.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => setActiveTab(tab.key)}
                      className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                        activeTab === tab.key
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40"
                          : "text-white/90 hover:bg-white/10 hover:text-white border border-white/5"
                      }`}
                    >
                      {tab.label}
                    </button>
                  )}
                  {tab.submodules && activeTab === tab.key && (
                    <div className="ml-4 space-y-1">
                      {tab.submodules.map((sub) => (
                        <Link
                          key={sub.key}
                          href={sub.href}
                          className="block w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 text-white/80 hover:bg-white/10 hover:text-white border border-white/5"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10 shadow-lg"
          aria-label="Open sidebar"
        >
          <span className="text-white text-xl">☰</span>
        </button>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-0 md:ml-72" : "ml-0"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex h-10 w-10 items-center cursor-pointer justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
              >
                <span className="text-lg">←</span>
              </Link>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">
                  QHSE
                </p>
                <h1 className="text-2xl font-bold">
                  Quality, Health, Safety &amp; Environment
                </h1>
              </div>
            </div>
          </header>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-2xl space-y-6">
            {activeTab === "training" && (
              <div className="space-y-4">
                <p className="text-sm text-slate-200 max-w-xl">
                  Manage your annual training matrix and individual training
                  records (attendance, completion status, etc.).
                </p>
                <div className="grid gap-4 sm:grid-cols-2 max-w-xl">
                  <Link
                    href="/qhse/training/create/plan"
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 hover:bg-white/10 transition shadow-md"
                  >
                    <p className="text-[11px] uppercase tracking-[0.25em] text-amber-200 font-semibold">
                      Step 1
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                      Training Plan
                    </h2>
                    <p className="mt-1 text-xs text-slate-200">
                      Create the annual training plan (Jan–Dec) for a selected
                      year.
                    </p>
                  </Link>

                  <Link
                    href="/qhse/training/create/record"
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 hover:bg-white/10 transition shadow-md"
                  >
                    <p className="text-[11px] uppercase tracking-[0.25em] text-sky-200 font-semibold">
                      Step 2
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                      Training Records
                    </h2>
                    <p className="mt-1 text-xs text-slate-200">
                      For each planned session, create a training record with
                      actual date and attendance.
                    </p>
                  </Link>
                </div>
              </div>
            )}

            {activeTab !== "training" && (
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-200">
                  {sidebarTabs.find((t) => t.key === activeTab)?.label}
                </p>
                <p className="text-sm text-slate-200 max-w-xl">
                  This section will be implemented later. For now, Training is
                  the primary active area in QHSE.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

