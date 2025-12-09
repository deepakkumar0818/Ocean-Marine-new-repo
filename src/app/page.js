import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-bold">STS Management System</h1>
        <p className="text-slate-200">
          Proceed to the dashboard to view operations, PMS, and QHSE panels.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-orange-600"
        >
          Go to Dashboard
        </Link>
    </div>
    </main>
  );
}
