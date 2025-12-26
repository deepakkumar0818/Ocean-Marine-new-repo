"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QhseSidebar from "../../../components/QhseSidebar";

// Generate dynamic years: 2 years back, current year, and 5 years forward
function getYears() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 2; i < currentYear; i++) {
    years.push(i);
  }
  for (let i = currentYear; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
}

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function monthFromDateString(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.getMonth(); // 0–11
}

export default function TrainingRecordPage({ hideSidebar = false }) {
  const initialYears = getYears();
  const currentYear = new Date().getFullYear();
  const [availableYears, setAvailableYears] = useState(initialYears);
  const [loadingYears, setLoadingYears] = useState(false);
  const [year, setYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [plan, setPlan] = useState(null);
  const [planError, setPlanError] = useState(null);

  const [creatingFor, setCreatingFor] = useState(null);
  const [actualDate, setActualDate] = useState("");
  const [traineesText, setTraineesText] = useState("");
  const [savingRecord, setSavingRecord] = useState(false);
  const [recordMessage, setRecordMessage] = useState(null);
  const [recordError, setRecordError] = useState(null);

  // Fetch available years on mount
  useEffect(() => {
    async function fetchAvailableYears() {
      setLoadingYears(true);
      try {
        const res = await fetch("/api/qhse/training/plan");
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          const merged = Array.from(new Set([...initialYears, ...data.data])).sort(
            (a, b) => b - a
          );
          setAvailableYears(merged);
          if (!merged.includes(year)) {
            setYear(merged[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch available years:", err);
      } finally {
        setLoadingYears(false);
      }
    }
    fetchAvailableYears();
  }, []);

  // Fetch plan when year changes
  useEffect(() => {
    if (!year) return;

    async function fetchPlan() {
      setLoadingPlan(true);
      setPlan(null);
      setPlanError(null);
      setCreatingFor(null);
      setRecordMessage(null);
      setRecordError(null);

      try {
        const res = await fetch(`/api/qhse/training/plan?year=${year}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.error || "No approved training plan found for this year"
          );
        }
        
        // Handle case where plan is null (no approved plan for this year)
        if (!data.data) {
          setPlan(null);
          setPlanError("No approved training plan found for this year. Please create and approve a training plan first.");
        } else {
          console.log(data.data);
          setPlan(data.data);
          setPlanError(null);
        }
      } catch (err) {
        setPlanError(err.message);
        setPlan(null);
      } finally {
        setLoadingPlan(false);
      }
    }

    fetchPlan();
  }, [year]);

  const planItemsByMonth = () => {
    if (!plan?.planItems?.length) return {};
    const buckets = {};
    plan.planItems.forEach((item) => {
      const m = monthFromDateString(item.plannedDate);
      if (m == null) return;
      if (!buckets[m]) buckets[m] = [];
      buckets[m].push(item);
    });
    return buckets;
  };

  const monthBuckets = planItemsByMonth();

  const handleCreateClick = (item) => {
    setCreatingFor(item);
    setRecordMessage(null);
    setRecordError(null);
    setActualDate(new Date().toISOString().slice(0, 10));
    setTraineesText("");
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    if (!creatingFor || !plan) return;

    setSavingRecord(true);
    setRecordMessage(null);
    setRecordError(null);

    try {
      const attendance = traineesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((name) => ({ traineeName: name }));

      if (!attendance.length) {
        setRecordError("Please enter at least one trainee name.");
        setSavingRecord(false);
        return;
      }

      const res = await fetch("/api/qhse/training/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainingPlanId: plan._id,
          plannedDate: creatingFor.plannedDate,
          topic: creatingFor.topic,
          instructor: creatingFor.instructor,
          actualTrainingDate: actualDate,
          attendance,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create training record");
      }

      setRecordMessage("Training record created in Draft status.");
      setCreatingFor(null);
    } catch (err) {
      setRecordError(err.message);
    } finally {
      setSavingRecord(false);
    }
  };

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
                  QHSE / Training
                </p>
                <h1 className="text-2xl font-bold">Training Records</h1>
              </div>
            </div>

            <Link
              href="/qhse"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 transition"
            >
              QHSE Home
            </Link>
          </header>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Year + month rail */}
            <div className="md:w-56">
              <div className="mb-2 space-y-2">
                <button className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold tracking-[0.22em] uppercase">
                  {year} +
                </button>

                <div className="flex gap-2">
                  <button className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] uppercase">
                    Training Report
                  </button>
                </div>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-200">
                  Year
                </span>
                <select
                  className="bg-white/5 border border-white/20 rounded-full px-3 py-1 text-[11px] tracking-[0.2em] uppercase focus:outline-none"
                  value={year || ""}
                  onChange={(e) => setYear(Number(e.target.value))}
                  disabled={loadingYears || availableYears.length === 0}
                >
                  {loadingYears ? (
                    <option>Loading...</option>
                  ) : availableYears.length === 0 ? (
                    <option>No data available</option>
                  ) : (
                    availableYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="rounded-md bg-white/85 text-slate-900 text-xs font-semibold tracking-[0.24em] uppercase flex flex-col shadow">
                {MONTHS.map((m, idx) => {
                  const hasPlanItems = plan && monthBuckets[idx]?.length > 0;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMonth(idx)}
                      className={`px-4 py-1 text-left hover:bg-sky-100 flex items-center justify-between ${
                        selectedMonth === idx ? "bg-sky-200" : ""
                      }`}
                    >
                      <span>{m}</span>
                      {hasPlanItems && (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          ●
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: plan items and create record form */}
            <div className="flex-1 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-sky-200 font-semibold mb-2">
                  {selectedMonth != null
                    ? `${MONTHS[selectedMonth]} ${year}`
                    : `Year ${year}`}
                </p>

                {loadingPlan && (
                  <p className="text-xs text-slate-100">
                    Loading training plan…
                  </p>
                )}
                {planError && !loadingPlan && (
                  <p className="text-xs text-red-300">{planError}</p>
                )}
                {!loadingPlan && !planError && !plan && (
                  <p className="text-xs text-slate-100">
                    Select a year to load the approved training plan.
                  </p>
                )}

                {plan && (
                  <div className="space-y-3 mt-2">
                    {selectedMonth == null && (
                      <p className="text-xs text-slate-100">
                        Select a month on the left to see the plan items and
                        create records.
                      </p>
                    )}

                    {selectedMonth != null &&
                      (monthBuckets[selectedMonth]?.length ? (
                        monthBuckets[selectedMonth].map((item, idx) => (
                          <div
                            key={`${item._id || idx}-${item.plannedDate}`}
                            className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                          >
                            <div>
                              <p className="font-semibold text-white">
                                {item.topic}
                              </p>
                              <p className="text-slate-200">
                                Instructor: {item.instructor || "—"}
                              </p>
                              <p className="text-slate-300">
                                Planned:{" "}
                                {new Date(
                                  item.plannedDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCreateClick(item)}
                              className="self-start sm:self-auto inline-flex items-center rounded-full bg-orange-500 hover:bg-orange-400 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] shadow"
                            >
                              Create Record
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-100">
                          No plan items for this month.
                        </p>
                      ))}
                  </div>
                )}
              </div>

              {/* Record creation panel */}
              {creatingFor && (
                <form
                  onSubmit={handleRecordSubmit}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-semibold tracking-[0.18em] uppercase">
                        Create Training Record
                      </h2>
                      <p className="text-[11px] text-slate-200">
                        Topic: {creatingFor.topic} | Instructor:{" "}
                        {creatingFor.instructor}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCreatingFor(null)}
                      className="text-xs text-slate-200 hover:text-white cursor-pointer"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-200">
                        Planned Date
                      </label>
                      <input
                        type="date"
                        disabled
                        value={
                          creatingFor.plannedDate?.slice(0, 10) ||
                          new Date().toISOString().slice(0, 10)
                        }
                        className="w-full rounded-lg bg-white/10 border border-white/15 px-3 py-1.5 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-200">
                        Actual Training Date
                      </label>
                      <input
                        type="date"
                        value={actualDate}
                        onChange={(e) => setActualDate(e.target.value)}
                        className="w-full rounded-lg bg-white/10 border border-white/15 px-3 py-1.5 text-sm focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-200">
                      Attendance (one trainee per line)
                    </label>
                    <textarea
                      rows={4}
                      value={traineesText}
                      onChange={(e) => setTraineesText(e.target.value)}
                      placeholder={"e.g.\nJohn Smith\nChief Officer\nAB Crew 1"}
                      className="w-full rounded-lg bg-white/10 border border-white/15 px-3 py-1.5 text-sm focus:outline-none resize-none"
                    />
                  </div>

                  {recordError && (
                    <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2">
                      {recordError}
                    </p>
                  )}
                  {recordMessage && (
                    <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-xl px-3 py-2">
                      {recordMessage}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingRecord}
                      className="inline-flex items-center rounded-full cursor-pointer bg-orange-500 hover:bg-orange-400 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {savingRecord ? "Saving..." : "Create Record"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
  );

  if (hideSidebar) {
    return content;
  }

  return (
    <div className="min-h-screen bg-transparent text-white flex">
      <QhseSidebar />
      <div className="flex-1 ml-[300px]">{content}</div>
    </div>
  );
}
