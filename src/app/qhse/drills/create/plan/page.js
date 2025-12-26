"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Generate dynamic years: 2 years back, current year, and 5 years forward
function getYears() {
  const currentYear = new Date().getFullYear();
  const years = [];
  // 2 years in the past
  for (let i = currentYear - 2; i < currentYear; i++) {
    years.push(i);
  }
  // Current year and 5 years forward
  for (let i = currentYear; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
}

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

// Get quarter start date based on year and quarter index
function getQuarterStartDate(year, quarterIndex) {
  const month = quarterIndex * 3; // Q1=0, Q2=3, Q3=6, Q4=9
  return new Date(year, month, 1).toISOString().slice(0, 10);
}

export default function DrillsPlanPage({ hideSidebar = false }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const initialYear = currentYear;

  const [year, setYear] = useState(initialYear);
  const [selectedQuarter, setSelectedQuarter] = useState(0); // 0-3 index
  const [quarterData, setQuarterData] = useState(() => {
    // Initialize all 4 quarters with empty data
    return QUARTERS.map((_, index) => ({
      plannedDate: getQuarterStartDate(initialYear, index),
      topic: "",
      instructor: "",
      description: "",
    }));
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleYearChange = (newYear) => {
    setYear(newYear);
    setQuarterData((prev) =>
      prev.map((data, index) => ({
        ...data,
        plannedDate: getQuarterStartDate(newYear, index),
      }))
    );
    setMessage(null);
    setError(null);
  };

  const handleFieldChange = (field, value) => {
    setQuarterData((prev) => {
      const next = [...prev];
      next[selectedQuarter] = { ...next[selectedQuarter], [field]: value };
      return next;
    });
  };

  const handleNextQuarter = () => {
    if (selectedQuarter < QUARTERS.length - 1) {
      setSelectedQuarter(selectedQuarter + 1);
    }
  };

  const handlePrevQuarter = () => {
    if (selectedQuarter > 0) {
      setSelectedQuarter(selectedQuarter - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      // Filter out quarters where topic or instructor is empty
      const planItems = quarterData
        .filter((item) => item.topic.trim() && item.instructor.trim())
        .map((item) => ({
          plannedDate: item.plannedDate,
          topic: item.topic.trim(),
          instructor: item.instructor.trim(),
          description: item.description.trim() || undefined,
        }));

      if (!planItems.length) {
        setError("Please fill at least one quarter with Topic and Instructor.");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/qhse/drill/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planItems, year }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create drill plan");
      }

      setMessage(`✅ Drill plan for ${year} saved successfully!`);
      setError(null);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message);
      setMessage(null);
    } finally {
      setSaving(false);
    }
  };

  const currentQuarterData = quarterData[selectedQuarter];
  const hasData =
    currentQuarterData.topic.trim() ||
    currentQuarterData.instructor.trim() ||
    currentQuarterData.description.trim();

  const content = (
    <div className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/qhse"
                className="flex h-10 w-10 items-center cursor-pointer justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
              >
                <span className="text-lg">←</span>
              </Link>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">
                  QHSE / Drills
                </p>
                <h1 className="text-2xl font-bold">Drill Plan</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-200">
                Year
              </span>
              <select
                className="bg-white/5 border border-white/20 rounded-full px-3 py-1 text-xs tracking-widest uppercase focus:outline-none"
                value={year}
                onChange={(e) => handleYearChange(Number(e.target.value))}
              >
                {getYears().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-2xl space-y-6"
          >
            {/* Quarter Slider */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300 text-center">
                Select Quarter
              </p>
              <div className="flex items-center gap-1 border border-sky-400/30 rounded-xl bg-white/5 p-1 overflow-x-auto">
                {QUARTERS.map((quarter, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedQuarter(index)}
                    className={`flex-1 min-w-[80px] px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      selectedQuarter === index
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40"
                        : index === 3
                        ? "bg-orange-500/20 text-orange-300 border border-orange-400/50"
                        : "text-sky-200 hover:bg-white/10 border border-transparent"
                    } ${hasData && selectedQuarter === index ? "ring-2 ring-emerald-400/50" : ""}`}
                  >
                    {quarter}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="rounded-2xl border border-white/10 bg-[#0b2740]/80 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">
                    {QUARTERS[selectedQuarter]} {year}
                  </h2>
                  <div className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                    <span className="text-xs font-semibold text-amber-200 uppercase tracking-wide">
                      Status: Draft
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedQuarter > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevQuarter}
                      className="px-3 py-1 rounded-lg border border-white/20 bg-white/5 text-xs font-semibold hover:bg-white/10 transition"
                    >
                      ← Prev
                    </button>
                  )}
                  {selectedQuarter < QUARTERS.length - 1 && (
                    <button
                      type="button"
                      onClick={handleNextQuarter}
                      className="px-3 py-1 rounded-lg border border-white/20 bg-white/5 text-xs font-semibold hover:bg-white/10 transition"
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="planned-date" className="block text-sm font-semibold text-white/90">
                    Drill Planned on :
                  </label>
                  <div className="relative">
                    <input
                      id="planned-date"
                      type="date"
                      value={currentQuarterData.plannedDate}
                      onChange={(e) => handleFieldChange("plannedDate", e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
                      📅
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="instructor" className="block text-sm font-semibold text-white/90">
                    Instructor :
                  </label>
                  <input
                    id="instructor"
                    type="text"
                    value={currentQuarterData.instructor}
                    onChange={(e) => handleFieldChange("instructor", e.target.value)}
                    placeholder="Enter instructor name"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="topic" className="block text-sm font-semibold text-white/90">
                    Topic :
                  </label>
                  <input
                    id="topic"
                    type="text"
                    value={currentQuarterData.topic}
                    onChange={(e) => handleFieldChange("topic", e.target.value)}
                    placeholder="Enter drill topic"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none"
                  />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <label htmlFor="description" className="block text-sm font-semibold text-white/90">
                    Description :
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={currentQuarterData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Enter drill description"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="text-sm text-red-300 bg-red-950/40 border border-red-500/40 rounded-lg px-4 py-3 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            {message && (
              <div className="text-base text-emerald-300 bg-emerald-950/40 border-2 border-emerald-500/60 rounded-lg px-6 py-4 flex items-center gap-3 shadow-lg shadow-emerald-500/20">
                <span className="text-2xl">✅</span>
                <span className="font-semibold">{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-sm font-semibold uppercase tracking-[0.2em] shadow-lg shadow-orange-500/40 hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>✉️✓→</span>
                <span>{saving ? "Saving..." : "Send for Approval"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
  );

  if (hideSidebar) {
    return content;
  }

  return (
    <div className="min-h-screen bg-transparent text-white flex">
      {/* Left Sidebar - same as QHSE main page */}
      <div className="fixed left-0 top-0 h-full bg-slate-900/98 border-r border-white/20 shadow-2xl backdrop-blur-md z-50" style={{ width: "280px" }}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Navigation</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="px-4 py-3 rounded-xl text-sm font-medium bg-orange-500 text-white shadow-lg shadow-orange-500/40">
                  Drills
                </div>
                <div className="ml-4 space-y-1">
                  <Link
                    href="/qhse/drills/create/plan"
                    className={`block w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      pathname === "/qhse/drills/create/plan"
                        ? "bg-orange-400/30 text-white border border-orange-400/50"
                        : "text-white/80 hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                  >
                    Drill Plan
                  </Link>
                  <Link
                    href="/qhse/drills/create/report"
                    className={`block w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      pathname === "/qhse/drills/create/report"
                        ? "bg-orange-400/30 text-white border border-orange-400/50"
                        : "text-white/80 hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                  >
                    Drill Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {content}
      </div>
    </div>
  );
}