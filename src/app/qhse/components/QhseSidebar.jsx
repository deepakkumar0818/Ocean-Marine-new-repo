"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  {
    key: "drills",
    label: "Drills",
    submodules: [
      { key: "drill-plan", label: "Drill Plan", href: "/qhse/drills/create/plan" },
      { key: "drill-report", label: "Drill Report", href: "/qhse/drills/create/report" },
    ],
  },
  { key: "forms", label: "Forms & checklist",},
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
  { key: "best-practices", label: "Best practices",},
  {
    key: "near-miss",
    label: "Near-miss reporting",
    href: "/qhse/near-miss",
  },
  { key: "moc", label: "MOC"},
  {
    key: "due-diligence",
    label: "Due diligence / subcontractor audits",
    submodules: [
      {
        key: "audit-sub-contractor",
        label: "Audit Form - Sub Contractor",
        nestedSubmodules: [
          {
            key: "audit-form",
            label: "Form",
            href: "/qhse/due-diligence-subconstructor/audit-sub-contractor/form",
          },
          {
            key: "audit-list-user",
            label: "My Forms",
            href: "/qhse/due-diligence-subconstructor/audit-sub-contractor/list-user",
          },
          {
            key: "audit-list-admin",
            label: "Admin Review",
            href: "/qhse/due-diligence-subconstructor/audit-sub-contractor/list-admin",
          },
          {
            key: "audit-list-approved",
            label: "Approved History",
            href: "/qhse/due-diligence-subconstructor/audit-sub-contractor/list-approved",
          },
        ],
      },
      {
        key: "due-diligence-questionnaire",
        label: "Supplier Due Diligence Questionnaire",
        nestedSubmodules: [
          {
            key: "questionnaire-form",
            label: "Form",
            href: "/qhse/due-diligence-subconstructor/due-diligence-questionnaire/questionnaire-form",
          },
          {
            key: "questionnaire-list-user",
            label: "My Forms",
            href: "/qhse/due-diligence-subconstructor/due-diligence-questionnaire/questionnaire-list-user",
          },
          {
            key: "questionnaire-list-admin",
            label: "Admin Review",
            href: "/qhse/due-diligence-subconstructor/due-diligence-questionnaire/questionnaire-list-admin",
          },
          {
            key: "questionnaire-list-admin-history",
            label: "Approved History",
            href: "/qhse/due-diligence-subconstructor/due-diligence-questionnaire/questionnaire-list-admin-history",
          },
        ],
      },
    ],
  },
  {
    key: "audits",
    label: "Audits & inspection planner",
  },
  {
    key: "poac",
    label: "POAC cross competency",
  },
  { key: "kpi", label: "KPI", },
];

export default function QhseSidebar() {
  const [activeTab, setActiveTab] = useState("training");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedNestedSubmodules, setExpandedNestedSubmodules] = useState(new Set());
  const sidebarRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive active tab from current route and auto-expand nested submodules
  useEffect(() => {
    if (pathname.startsWith("/qhse/defects-list")) {
      setActiveTab("defects");
    } else if (pathname.startsWith("/qhse/training")) {
      setActiveTab("training");
    } else if (pathname.startsWith("/qhse/near-miss")) {
      setActiveTab("near-miss");
    } else if (pathname.startsWith("/qhse/due-diligence-subconstructor")) {
      setActiveTab("due-diligence");
      // Auto-expand the nested submodule if we're on one of its pages
      if (pathname.startsWith("/qhse/due-diligence-subconstructor/audit-sub-contractor")) {
        setExpandedNestedSubmodules((prev) => new Set([...prev, "audit-sub-contractor"]));
      } else if (pathname.startsWith("/qhse/due-diligence-subconstructor/due-diligence-questionnaire")) {
        setExpandedNestedSubmodules((prev) => new Set([...prev, "due-diligence-questionnaire"]));
      }
    } else if (pathname.startsWith("/qhse/drills")) {
      setActiveTab("drills");
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

  const handleModuleClick = (tab) => {
    // If we're on the main QHSE page, use query params to show form inline
    if (pathname === "/qhse" || pathname === "/qhse/") {
      setActiveTab(tab.key);
      // Navigate to first submodule using query params
      if (tab.submodules && tab.submodules.length > 0) {
        const firstSub = tab.submodules[0];
        if (firstSub.href) {
          // Extract module and submodule from href
          const hrefParts = firstSub.href.split("/");
          const moduleIndex = hrefParts.findIndex(part => part === "training" || part === "drills");
          if (moduleIndex !== -1) {
            const module = hrefParts[moduleIndex];
            const submodule = hrefParts[moduleIndex + 2] || "plan"; // e.g., "plan" or "record"
            router.push(`/qhse?module=${module}&submodule=${submodule}`);
            return;
          }
        }
      }
      return;
    }
    
    // If module has submodules, navigate to first submodule
    if (tab.submodules && tab.submodules.length > 0) {
      const firstSub = tab.submodules[0];
      if (firstSub.nestedSubmodules && firstSub.nestedSubmodules.length > 0) {
        router.push(firstSub.nestedSubmodules[0].href);
      } else if (firstSub.href) {
        router.push(firstSub.href);
      }
    } else if (tab.href) {
      router.push(tab.href);
    } else {
      setActiveTab(tab.key);
    }
  };

  const handleNestedSubmoduleClick = (subKey, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedNestedSubmodules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subKey)) {
        newSet.delete(subKey);
      } else {
        newSet.add(subKey);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Left Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/20 shadow-2xl backdrop-blur-md z-50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "300px" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h2 className="text-lg font-bold text-white">QHSE Modules</h2>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition hover:scale-110"
              aria-label="Close sidebar"
            >
              <span className="text-white text-lg">×</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1.5">
              {sidebarTabs.map((tab) => (
                <div key={tab.key} className="space-y-1">
                  {tab.href ? (
                    <Link
                      href={tab.href}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/40 scale-[1.02]"
                          : "text-white/90 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10 hover:scale-[1.01]"
                      }`}
                    >
                      {tab.icon && (
                        <span className="text-lg transition-transform group-hover:scale-110">
                          {tab.icon}
                        </span>
                      )}
                      <span className="flex-1">{tab.label}</span>
                      {activeTab === tab.key && (
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleModuleClick(tab)}
                      className={`group flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/40 scale-[1.02]"
                          : "text-white/90 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10 hover:scale-[1.01]"
                      }`}
                    >
                      {tab.icon && (
                        <span className="text-lg transition-transform group-hover:scale-110">
                          {tab.icon}
                        </span>
                      )}
                      <span className="flex-1">{tab.label}</span>
                      {tab.submodules && (
                        <span
                          className={`text-sm transition-transform ${
                            activeTab === tab.key ? "rotate-90" : ""
                          }`}
                        >
                          ▶
                        </span>
                      )}
                      {activeTab === tab.key && (
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                      )}
                    </button>
                  )}
                  {tab.submodules && activeTab === tab.key && (
                    <div className="ml-4 space-y-1 mt-1.5 pl-4 border-l-2 border-orange-500/30">
                      {tab.submodules.map((sub) => {
                        const isOnMainPage = pathname === "/qhse" || pathname === "/qhse/";
                        
                        // Convert href to query params for main page
                        const getSubmoduleLink = (href) => {
                          if (isOnMainPage && href) {
                            // Extract module and submodule from href
                            const hrefParts = href.split("/");
                            const moduleIndex = hrefParts.findIndex(part => 
                              part === "training" || part === "drills"
                            );
                            if (moduleIndex !== -1) {
                              const module = hrefParts[moduleIndex];
                              const submodule = hrefParts[moduleIndex + 2] || "plan";
                              return `/qhse?module=${module}&submodule=${submodule}`;
                            }
                          }
                          return href;
                        };
                        
                        const isActiveSub =
                          pathname === sub.href ||
                          pathname.startsWith(sub.href + "/") ||
                          (isOnMainPage && searchParams?.get("module") === tab.key && searchParams?.get("submodule") === (sub.href?.split("/").pop() || sub.key.split("-").pop()));
                        const isExpanded = expandedNestedSubmodules.has(sub.key);
                        const hasActiveNested = sub.nestedSubmodules?.some(
                          (nested) =>
                            pathname === nested.href ||
                            pathname.startsWith(nested.href + "/") ||
                            (isOnMainPage && searchParams?.get("module") === "due-diligence" && searchParams?.get("submodule") === nested.key.split("-").pop())
                        );
                        
                        return (
                          <div key={sub.key}>
                            {sub.nestedSubmodules ? (
                              <>
                                <button
                                  onClick={(e) => handleNestedSubmoduleClick(sub.key, e)}
                                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 border mb-1 ${
                                    hasActiveNested
                                      ? "text-orange-300 bg-orange-500/10 border-orange-500/30"
                                      : "text-orange-300/80 bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10 hover:border-orange-500/30"
                                  }`}
                                >
                                  <span>{sub.label}</span>
                                  <span
                                    className={`text-sm transition-transform ${
                                      isExpanded ? "rotate-90" : ""
                                    }`}
                                  >
                                    ▶
                                  </span>
                                </button>
                                {isExpanded && (
                                  <div className="ml-2 space-y-1 mb-2">
                                    {sub.nestedSubmodules.map((nested) => {
                                      const isActiveNested =
                                        pathname === nested.href ||
                                        pathname.startsWith(nested.href + "/") ||
                                        (isOnMainPage && searchParams?.get("module") === "due-diligence" && searchParams?.get("submodule") === nested.key.split("-").pop());
                                      return (
                                        <Link
                                          key={nested.key}
                                          href={getSubmoduleLink(nested.href)}
                                          className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border ${
                                            isActiveNested
                                              ? "bg-white/20 text-white border-orange-400/50 shadow-md"
                                              : "text-white/70 hover:bg-white/10 hover:text-white border-white/5 hover:border-white/10"
                                          }`}
                                        >
                                          <span className="flex items-center gap-2">
                                            <span className="text-xs">▸</span>
                                            {nested.label}
                                          </span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                href={getSubmoduleLink(sub.href)}
                                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border ${
                                  isActiveSub
                                    ? "bg-white/20 text-white border-orange-400/50 shadow-md"
                                    : "text-white/80 hover:bg-white/10 hover:text-white border-white/5 hover:border-white/10"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="text-xs">▸</span>
                                  {sub.label}
                                </span>
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-slate-800/50">
            <p className="text-[10px] text-slate-400 text-center">
              QHSE Management System
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition border border-orange-400/30 shadow-lg shadow-orange-500/30 hover:scale-110"
          aria-label="Open sidebar"
        >
          <span className="text-white text-xl">☰</span>
        </button>
      )}
    </>
  );
}
