import Link from "next/link";

export default function PmsPage() {
  return (
    <div className="min-h-screen bg-transparent text-white px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300 font-semibold mb-2">
            PMS
          </p>
          <Link
            href="/dashboard"
            className="flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
          >
            ← Back
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Preventive Maintenance</h1>
          <p className="text-sm text-slate-200 mt-2">
            Right now we don&apos;t have any PMS data. It will arrive in the future.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-xl">
          <div className="grid gap-4 md:grid-cols-3">
            {["Overdue", "Scheduled", "Completed"].map((label, idx) => (
              <div
                key={label}
                className={`rounded-2xl border border-white/10 bg-white/5 px-4 py-5 ${
                  idx === 0
                    ? "text-amber-200"
                    : idx === 1
                    ? "text-sky-200"
                    : "text-emerald-200"
                }`}
              >
                <p className="text-sm uppercase tracking-wide">{label}</p>
                <p className="text-3xl font-bold">—</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-200">
            Placeholder cards for PMS stats. Data will be shown here once connected.
          </p>
        </div>
      </div>
    </div>
  );
}

