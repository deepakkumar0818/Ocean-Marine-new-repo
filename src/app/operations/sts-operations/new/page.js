"use client";

import Link from "next/link";
import { useState, useEffect, useRef, forwardRef } from "react";
import { usePathname } from "next/navigation";

const statusTone = {
  INPROGRESS: {
    dot: "bg-sky-400",
    pill: "bg-sky-500/15 border-sky-400/40 text-sky-100",
    option: "text-sky-100",
  },
  COMPLETED: {
    dot: "bg-emerald-400",
    pill: "bg-emerald-500/15 border-emerald-400/40 text-emerald-100",
    option: "text-emerald-100",
  },
  PENDING: {
    dot: "bg-amber-400",
    pill: "bg-amber-500/15 border-amber-400/40 text-amber-100",
    option: "text-amber-100",
  },
  CANCELED: {
    dot: "bg-red-400",
    pill: "bg-red-500/15 border-red-400/40 text-red-100",
    option: "text-red-100",
  },
};

const sidebarTabs = [
  { key: "documentation", label: "Documentation", href: "/operations/sts-operations/new" },
  { key: "compatibility", label: "Compatibility", href: "/operations/sts-operations/new/compatibility" },
  { key: "hose-transfer", label: "Hose transfer record", href: "#" },
  { key: "forms", label: "Forms and checklist", href: "#" },
  { key: "ports", label: "Ports and Terminals", href: "#" },
];

export default function NewOperationPage() {
  const [status, setStatus] = useState("INPROGRESS");
  const [showStatusList, setShowStatusList] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const statusRef = useRef(null);
  const sidebarRef = useRef(null);
  const pathname = usePathname();

  const statuses = [
    { key: "INPROGRESS", label: "In progress" },
    { key: "COMPLETED", label: "Completed" },
    { key: "PENDING", label: "Pending" },
    { key: "CANCELED", label: "Canceled" },
  ];

  useEffect(() => {
    const handler = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setShowStatusList(false);
      }
    };
    if (showStatusList) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showStatusList]);

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

  const activeTab = sidebarTabs.find(tab => pathname === tab.href)?.key || "documentation";

  const docFields = [
    { label: "SSQ", side: "left" },
    { label: "Q88", side: "left" },
    { label: "Mooring Arr", side: "left" },
    { label: "GA Plan", side: "right" },
    { label: "MSDS", side: "right" },
    { label: "Indemnity", side: "right" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white flex">
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
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    activeTab === tab.key
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40"
                      : "text-white/90 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {tab.label}
                </Link>
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
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-0 md:ml-72" : "ml-0"}`}>
        <div className="mx-auto max-w-6xl px-6 py-8">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
              >
                <span className="text-lg">←</span>
              </Link>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">
                  STS Management System
                </p>
                <h1 className="text-2xl font-bold">New Operation</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="#"
                className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur md:inline-flex"
              >
                Client: OG
              </Link>
              <div
                className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-wide md:flex ${statusTone[status]?.pill || "bg-white/10 border-white/10 text-white"}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${statusTone[status]?.dot || "bg-white"}`}
                />
                {statuses.find((s) => s.key === status)?.label || status}
              </div>
            </div>
          </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-2xl">
          <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
            <StatusDropdown
              status={status}
              onSelect={(val) => {
                setStatus(val);
                setShowStatusList(false);
              }}
              show={showStatusList}
              setShow={setShowStatusList}
              statuses={statuses}
              ref={statusRef}
            />
            <div className="flex items-center gap-2 text-slate-200 text-sm">
              <span className="text-lg">📅</span>
              <span>Date From - Till</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Operation Ref No",
              "Type of operation",
              "Mooring Master",
              "Location",
              "Client",
              "Type of cargo",
              "Quantity",
            ].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-semibold text-white/80">
                  {field} :
                </label>
                <div className="h-12 rounded-xl border border-white/10 bg-white/5" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">CHS :</span>
                <div className="h-12 w-64 rounded-xl border border-white/10 bg-white/5" />
              </div>
              <span className="text-3xl text-white/70">← →</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">MS :</span>
                <div className="h-12 w-64 rounded-xl border border-white/10 bg-white/5" />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              {docFields
                .filter((item) => item.side === "left")
                .map((item) => (
                  <DocRow key={item.label} label={item.label} tone="navy" />
                ))}
            </div>
            <div className="space-y-4">
              {docFields
                .filter((item) => item.side === "right")
                .map((item) => (
                  <DocRow key={item.label} label={item.label} tone="orange" />
                ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function DocRow({ label, tone = "navy" }) {
  const toneClasses =
    tone === "orange"
      ? "bg-orange-500 text-white"
      : "bg-slate-900 text-white";

  return (
    <div className="flex items-center gap-3">
      <span
        className={`min-w-[110px] rounded-full px-4 py-2 text-sm font-semibold shadow ${toneClasses}`}
      >
        {label} :
      </span>
      <div className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70">
        Drag and drop
      </div>
    </div>
  );
}

const StatusDropdown = forwardRef(function StatusDropdown(
  { status, onSelect, show, setShow, statuses },
  ref
){
  const active = statuses.find((s) => s.key === status);
  const tone = statusTone[status] || {
    dot: "bg-white",
    pill: "bg-white/10 border-white/10 text-white",
    option: "text-white",
  };
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShow((v) => !v)}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide border hover:bg-white/15 transition ${tone.pill}`}
      >
        <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
        {active?.label || status}
        <span className="text-white/80 text-base leading-none">▾</span>
      </button>
      {show && (
        <div className="absolute left-0 top-full z-30 mt-2 w-40 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur shadow-xl">
          <div className="p-2 space-y-1">
            {statuses.map((item) => (
              <button
                key={item.key}
                onClick={() => onSelect(item.key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                  item.key === status
                    ? `${statusTone[item.key]?.pill || "bg-white/10 text-white"}`
                    : `${statusTone[item.key]?.option || "text-white"} hover:bg-white/10`
                }`}
              >
                <span
                  className={`mr-2 inline-block h-2 w-2 rounded-full ${statusTone[item.key]?.dot || "bg-white"}`}
                />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

