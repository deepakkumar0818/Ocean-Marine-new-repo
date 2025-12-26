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

export default function DrillsReportPage({ hideSidebar = false }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const initialYear = currentYear;

  const [year, setYear] = useState(initialYear);
  const [selectedQuarter, setSelectedQuarter] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    drillNo: "",
    drillDate: new Date().toISOString().slice(0, 10),
    location: "",
    drillScenario: "",
    participants: [
      { name: "", role: "" }
    ],
    incidentProgression: "",
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleParticipantChange = (index, field, value) => {
    setFormData((prev) => {
      const newParticipants = [...prev.participants];
      newParticipants[index] = {
        ...newParticipants[index],
        [field]: value,
      };
      return {
        ...prev,
        participants: newParticipants,
      };
    });
  };

  const addParticipant = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, { name: "", role: "" }],
    }));
  };

  const removeParticipant = (index) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      // Validate required fields
      if (!formData.drillNo.trim()) {
        setError("Drill No. is required.");
        setSaving(false);
        return;
      }

      if (!formData.drillDate) {
        setError("Drill Date is required.");
        setSaving(false);
        return;
      }

      if (!formData.drillScenario.trim()) {
        setError("Drill Scenario is required.");
        setSaving(false);
        return;
      }

      // Filter out empty participants
      const validParticipants = formData.participants.filter(
        (p) => p.name.trim() && p.role.trim()
      );

      if (validParticipants.length === 0) {
        setError("Please add at least one participant with name and role.");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/qhse/drill/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          participants: validParticipants,
          year,
          quarter: QUARTERS[selectedQuarter],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create drill report");
      }

      setMessage(`✅ Drill report saved successfully!`);
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
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">Drill Record</h1>
                  <div className="inline-block px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-400/50">
                    <span className="text-sm font-semibold text-orange-300">{year}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-200">
                Year
              </span>
              <select
                className="bg-white/5 border border-white/20 rounded-full px-3 py-1 text-xs tracking-widest uppercase focus:outline-none"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
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
            {/* Form Fields */}
            <div className="rounded-2xl border border-white/10 bg-[#0b2740]/80 p-6 space-y-6">
              {/* General Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="text-lg">➕</span>
                  <h2 className="text-lg font-semibold">General details</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="drill-no" className="block text-sm font-semibold text-white/90">
                      Drill No. :
                    </label>
                    <input
                      id="drill-no"
                      type="text"
                      value={formData.drillNo}
                      onChange={(e) => handleFieldChange("drillNo", e.target.value)}
                      placeholder="e.g., 006-2025"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="drill-date" className="block text-sm font-semibold text-white/90">
                      Drill Date :
                    </label>
                    <div className="relative">
                      <input
                        id="drill-date"
                        type="date"
                        value={formData.drillDate}
                        onChange={(e) => handleFieldChange("drillDate", e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
                        📅
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-semibold text-white/90">
                      Location :
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleFieldChange("location", e.target.value)}
                      placeholder="Location (e.g., Dubai D anchorage)"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="drill-scenario" className="block text-sm font-semibold text-white/90">
                      Drill Scenario :
                    </label>
                    <input
                      id="drill-scenario"
                      type="text"
                      value={formData.drillScenario}
                      onChange={(e) => handleFieldChange("drillScenario", e.target.value)}
                      placeholder="e.g., Fender Failure while approach"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Participants Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h2 className="text-lg font-semibold">Participants</h2>
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="px-3 py-1 rounded-lg border border-white/20 bg-white/5 text-xs font-semibold hover:bg-white/10 transition"
                  >
                    + Add Participant
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.participants.map((participant, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1 grid gap-3 md:grid-cols-2">
                        <input
                          type="text"
                          value={participant.name}
                          onChange={(e) =>
                            handleParticipantChange(index, "name", e.target.value)
                          }
                          placeholder="Participant Name"
                          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none"
                        />
                        <input
                          type="text"
                          value={participant.role}
                          onChange={(e) =>
                            handleParticipantChange(index, "role", e.target.value)
                          }
                          placeholder="Role (e.g., Designated Crisis Manager)"
                          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none"
                        />
                      </div>
                      {formData.participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="px-3 py-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Incident Progression Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <h2 className="text-lg font-semibold">Incident Progression :</h2>
                </div>

                <textarea
                  rows={8}
                  value={formData.incidentProgression}
                  onChange={(e) => handleFieldChange("incidentProgression", e.target.value)}
                  placeholder="Describe the incident progression in detail..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition outline-none resize-none"
                />
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
                className="px-6 py-3 rounded-xl bg-orange-500 text-sm font-semibold uppercase tracking-[0.2em] shadow-lg shadow-orange-500/40 hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Drill Report"}
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
      {/* Left Sidebar - same as Drill Plan */}
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

