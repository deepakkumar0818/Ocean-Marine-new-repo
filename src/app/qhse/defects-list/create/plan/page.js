"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DefectCreatePage() {
  const pathname = usePathname();

  const [form, setForm] = useState({
    equipmentDefect: "",
    base: "",
    actionRequired: "",
    targetDate: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/qhse/defects-list/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create equipment defect");
      }

      setMessage("Equipment defect created successfully with status OPEN.");
      setForm({
        equipmentDefect: "",
        base: "",
        actionRequired: "",
        targetDate: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex">
      {/* Left mini sidebar (like Training) */}
      <div
        className="fixed left-0 top-0 h-full bg-slate-900/98 border-r border-white/20 shadow-2xl backdrop-blur-md z-50"
        style={{ width: "280px" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Navigation</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="px-4 py-3 rounded-xl text-sm font-medium bg-orange-500 text-white shadow-lg shadow-orange-500/40">
                  Defects list
                </div>
                <div className="ml-4 space-y-1">
                  <Link
                    href="/qhse/defects-list/create/plan"
                    className={`block w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      pathname === "/qhse/defects-list/create/plan"
                        ? "bg-orange-400/30 text-white border border-orange-400/50"
                        : "text-white/80 hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                  >
                    Create defect
                  </Link>
                  <Link
                    href="/qhse/defects-list/create/list"
                    className={`block w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      pathname === "/qhse/defects-list/create/list"
                        ? "bg-orange-400/30 text-white border border-orange-400/50"
                        : "text-white/80 hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                  >
                    Defects list
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        <div className="mx-auto max-w-4xl px-6 py-10 space-y-6">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/qhse"
                className="flex h-10 w-10 items-center cursor-pointer justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
              >
                <span className="text-lg">←</span>
              </Link>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-300">
                  QHSE / Defects List
                </p>
                <h1 className="text-2xl font-bold">Create Equipment Defect</h1>
                <p className="text-xs text-slate-200 mt-1">
                  Register a new equipment defect. Status will be{" "}
                  <span className="font-semibold text-amber-300">OPEN</span> by
                  default.
                </p>
              </div>
            </div>
            <Link
              href="/qhse/defects-list/create/list"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 transition"
            >
              View Defects List
            </Link>
          </header>

          <main>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                  Status: <span className="text-emerald-300">Open</span>
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Equipment Defect */}
                <div>
                  <label
                    htmlFor="equipmentDefect"
                    className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-100 mb-1.5"
                  >
                    Equipment Defect
                  </label>
                  <textarea
                    id="equipmentDefect"
                    className="w-full rounded-xl bg-slate-900/40 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                    rows={3}
                    value={form.equipmentDefect}
                    onChange={(e) =>
                      handleChange("equipmentDefect", e.target.value)
                    }
                    placeholder="Describe the equipment defect"
                    required
                  />
                </div>

                {/* Base + Target Date */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="base"
                      className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-100 mb-1.5"
                    >
                      Base
                    </label>
                    <input
                      id="base"
                      type="text"
                      className="w-full rounded-xl bg-slate-900/40 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                      value={form.base}
                      onChange={(e) => handleChange("base", e.target.value)}
                      placeholder="Enter base / location"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="targetDate"
                      className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-100 mb-1.5"
                    >
                      Target Date
                    </label>
                    <input
                      id="targetDate"
                      type="date"
                      className="w-full rounded-xl bg-slate-900/40 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                      value={form.targetDate}
                      onChange={(e) =>
                        handleChange("targetDate", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Action Required */}
                <div>
                  <label
                    htmlFor="actionRequired"
                    className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-100 mb-1.5"
                  >
                    Action Required
                  </label>
                  <textarea
                    id="actionRequired"
                    className="w-full rounded-xl bg-slate-900/40 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                    rows={3}
                    value={form.actionRequired}
                    onChange={(e) =>
                      handleChange("actionRequired", e.target.value)
                    }
                    placeholder="Describe the corrective action required"
                    required
                  />
                </div>

                {/* Messages */}
                {error && (
                  <p className="text-xs text-red-300 bg-red-950/40 border border-red-500/40 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                {message && (
                  <p className="text-xs text-emerald-200 bg-emerald-950/40 border border-emerald-500/40 rounded-lg px-3 py-2">
                    {message}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        equipmentDefect: "",
                        base: "",
                        actionRequired: "",
                        targetDate: "",
                      })
                    }
                    className="rounded-full border border-white/20 bg-transparent px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                    disabled={submitting}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full bg-orange-500 hover:bg-orange-400 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] shadow disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Save Defect"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}