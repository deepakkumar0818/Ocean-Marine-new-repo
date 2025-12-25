"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import QhseSidebarWrapper from "./components/QhseSidebarWrapper";

const TrainingPlanForm = dynamic(() => import("./training/create/plan/page"), {
  ssr: false,
});

const TrainingRecordForm = dynamic(() => import("./training/create/record/page"), {
  ssr: false,
});

const DrillsPlanForm = dynamic(() => import("./drills/create/plan/page"), {
  ssr: false,
});

const DrillsReportForm = dynamic(() => import("./drills/create/report/page"), {
  ssr: false,
});

function QhsePageContent() {
  const searchParams = useSearchParams();
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);

  useEffect(() => {
    const module = searchParams.get("module");
    const submodule = searchParams.get("submodule");
    if (module) {
      setSelectedModule(module);
      setSelectedSubmodule(submodule || null);
    } else {
      setSelectedModule(null);
      setSelectedSubmodule(null);
    }
  }, [searchParams]);

  // If no module selected, show welcome page
  if (!selectedModule) {
    return (
      <div className="min-h-screen bg-transparent text-white flex">
        <QhseSidebarWrapper />
        <div className="flex-1 ml-72">
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

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur shadow-2xl space-y-6">
              <div className="space-y-4">
                <p className="text-base text-slate-200 max-w-3xl leading-relaxed">
                  Welcome to the QHSE Management System. Use the sidebar navigation to access different modules and manage your Quality, Health, Safety, and Environment processes.
                </p>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 hover:bg-white/10 transition shadow-md">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-amber-200 font-semibold">
                      Training
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                      Training Management
                    </h2>
                    <p className="mt-1 text-xs text-slate-200">
                      Manage annual training plans and individual training records.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 hover:bg-white/10 transition shadow-md">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-sky-200 font-semibold">
                      Drills
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                      Drill Management
                    </h2>
                    <p className="mt-1 text-xs text-slate-200">
                      Plan and report on safety drills and exercises.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 hover:bg-white/10 transition shadow-md">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-200 font-semibold">
                      Defects
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                      Defects List
                    </h2>
                    <p className="mt-1 text-xs text-slate-200">
                      Track and manage equipment defects and their resolution.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 hover:bg-white/10 transition shadow-md">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-purple-200 font-semibold">
                      Near-Miss
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                      Near-Miss Reporting
                    </h2>
                    <p className="mt-1 text-xs text-slate-200">
                      Report and review near-miss incidents for safety improvement.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 hover:bg-white/10 transition shadow-md">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-orange-200 font-semibold">
                      Due Diligence
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                      Subcontractor Audits
                    </h2>
                    <p className="mt-1 text-xs text-slate-200">
                      Manage subcontractor audits and due diligence questionnaires.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 hover:bg-white/10 transition shadow-md">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-200 font-semibold">
                      More Modules
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                      Additional Features
                    </h2>
                    <p className="mt-1 text-xs text-slate-200">
                      Forms, checklists, best practices, and more available in the sidebar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render form inline based on selected module
  return (
    <div className="min-h-screen bg-transparent text-white flex">
      <QhseSidebarWrapper />
      <div className="flex-1 ml-72">
        {selectedModule === "training" && selectedSubmodule === "plan" && (
          <TrainingPlanForm hideSidebar={true} />
        )}
        {selectedModule === "training" && selectedSubmodule === "record" && (
          <TrainingRecordForm hideSidebar={true} />
        )}
        {selectedModule === "drills" && selectedSubmodule === "plan" && (
          <DrillsPlanForm hideSidebar={true} />
        )}
        {selectedModule === "drills" && selectedSubmodule === "report" && (
          <DrillsReportForm hideSidebar={true} />
        )}
      </div>
    </div>
  );
}

export default function QhsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <QhsePageContent />
    </Suspense>
  );
}
