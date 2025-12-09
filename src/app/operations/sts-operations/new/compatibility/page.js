"use client";

import Link from "next/link";
import { useState } from "react";

const panels = {
  hose: {
    title: "Hose Calculation",
    items: [
      "Hose type selection",
      "Diameter and pressure placeholders",
      "Environmental factors",
      "Connection checklist",
    ],
  },
  fender: {
    title: "Fender Calculation",
    items: [
      "Vessel particulars placeholder",
      "Energy absorption inputs",
      "Standoff distances",
      "Fender arrangement checklist",
    ],
  },
};

export default function CompatibilityPage() {
  const [active, setActive] = useState("hose");
  const panel = panels[active];

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">
              Compatibility
            </p>
            <h1 className="text-2xl font-bold">
              Hose & Fender Calculation (UI only)
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5">
            <Link
              href="/operations/sts-operations/new"
              className="px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Documentation
            </Link>
            <span className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold">
              Compatibility
            </span>
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-2xl">
          <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
            {[
              { key: "hose", label: "Hose Calculation" },
              { key: "fender", label: "Fender Calculation" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active === tab.key
                    ? "bg-orange-500 text-white shadow shadow-orange-500/30"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{panel.title}</h2>
            <p className="text-sm text-slate-200">
              Placeholder UI for {panel.title.toLowerCase()}. Replace with real
              calculators when data is ready.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {panel.items.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-white/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

