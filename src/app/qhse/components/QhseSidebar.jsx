"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarTabs = [
  {
    key: "training",
    label: "Training",
    submodules: [
      {
        key: "training-plan",
        label: "Training Plan",
        href: "/qhse/training/create/plan",
      },
      {
        key: "training-record",
        label: "Training Record",
        href: "/qhse/training/create/record",
      },
    ],
  },
  { key: "drills", label: "Drills" },
  { key: "forms", label: "Forms & checklist" },
  {
    key: "defects",
    label: "Defects list",
    submodules: [
      {
        key: "defects-create",
        label: "Create defect",
        href: "/qhse/defects-list/create/plan",
      },
      {
        key: "defects-list",
        label: "Defects list",
        href: "/qhse/defects-list/create/list",
      },
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

export default function QhseSidebar() {
  const [activeTab, setActiveTab] = useState("training");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);
  const pathname = usePathname();

  // Derive active tab from current route
  useEffect(() => {
    if (pathname.startsWith("/qhse/defects-list")) {
      setActiveTab("defects");
    } else if (pathname.startsWith("/qhse/training")) {
      setActiveTab("training");
    } else if (pathname.startsWith("/qhse/near-miss")) {
      setActiveTab("near-miss");
    }
  }, [pathname]);

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
    <>
      {/* Left Sidebar */}
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
                      {tab.submodules.map((sub) => {
                        const isActiveSub =
                          pathname === sub.href ||
                          pathname.startsWith(sub.href + "/");
                        return (
                          <Link
                            key={sub.key}
                            href={sub.href}
                            className={`block w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 border border-white/5 ${
                              isActiveSub
                                ? "bg-white/20 text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
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
    </>
  );
}


