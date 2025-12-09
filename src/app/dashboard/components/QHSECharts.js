"use client";

import PropTypes from "prop-types";

export default function QHSECharts() {
  const metrics = [
    { label: "Open NCRs", value: "2", tone: "orange" },
    { label: "Incidents (30d)", value: "0", tone: "emerald" },
    { label: "Audits Scheduled", value: "4", tone: "sky" },
  ];

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">QHSE</h2>
          <p className="text-sm text-slate-300">
            Quality, health, safety, and environment overview.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
          Placeholder
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <InfoCard
            key={metric.label}
            title={metric.label}
            value={metric.value}
            tone={metric.tone}
          />
        ))}
      </div>
      <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
        <p className="text-sm text-slate-200">
          Right now we don&apos;t have any QHSE data. It will arrive in the future.
        </p>
      </div>
    </div>
  );
}

function InfoCard({ title, value, tone = "sky" }) {
  const toneClasses = {
    orange:
      "bg-gradient-to-br from-orange-500/25 via-orange-500/10 to-orange-500/5 text-orange-50 border-orange-400/40 shadow-orange-500/20",
    sky: "bg-gradient-to-br from-sky-500/25 via-sky-500/10 to-sky-500/5 text-sky-50 border-sky-400/40 shadow-sky-500/20",
    emerald:
      "bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-emerald-500/5 text-emerald-50 border-emerald-400/40 shadow-emerald-500/20",
  };

  return (
    <div
      className={`rounded-2xl border ${toneClasses[tone]} px-4 py-5 backdrop-blur shadow-lg`}
    >
      <p className="text-sm uppercase tracking-wide">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(["orange", "sky", "emerald"]),
};

