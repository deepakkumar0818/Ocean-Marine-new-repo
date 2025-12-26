"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QhseSidebar from "../../../components/QhseSidebar";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function QuestionnaireListAdminHistoryPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedForm, setSelectedForm] = useState(null);

  const fetchForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/qhse/due-diligence/due-diligence-questionnaire/list");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to load forms");
      }

      // Handle both possible response structures
      const allForms = data.supplierDueDiligences || data.data || [];
      
      // Filter only Approved forms for history
      const approvedForms = allForms.filter(
        (f) => f.status === "Approved"
      );
      
      // Sort by approved date (newest first)
      approvedForms.sort((a, b) => {
        const dateA = new Date(a.approvedAt || a.updatedAt || 0);
        const dateB = new Date(b.approvedAt || b.updatedAt || 0);
        return dateB - dateA;
      });
      
      setForms(approvedForms);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load forms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(forms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentForms = forms.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex">
      <QhseSidebar />

      <div className="flex-1 ml-72">
        <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
          <header className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/qhse"
                className="flex h-10 w-10 items-center cursor-pointer justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
              >
                <span className="text-lg">←</span>
              </Link>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-300">
                  QHSE / Due Diligence / Supplier Due Diligence Questionnaire
                </p>
                <h1 className="text-2xl font-bold">Approved Forms History</h1>
                <p className="text-xs text-slate-200 mt-1">
                  View all approved supplier due diligence forms.
                </p>
              </div>
            </div>
            <Link
              href="/qhse/due-diligence-subconstructor/due-diligence-questionnaire/questionnaire-list-admin"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Pending Review
            </Link>
          </header>

          {error && (
            <div className="text-xs text-red-300 bg-red-950/40 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <main className="space-y-6">
            {/* Detail Card - Shows when form is selected */}
            {selectedForm && (
              <div className="w-full rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Form Details
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        FORM CODE: <span className="font-mono text-sky-300">{selectedForm.formCode || "—"}</span>
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/50">
                      {selectedForm.status || "Approved"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedForm(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition text-white text-xl font-bold"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Display comprehensive form details */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">
                      Supplier Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Company/Person Incharge: </span>
                        <span className="text-white font-semibold">{selectedForm.supplierDetails?.inchargeNameAndCompany || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Contact: </span>
                        <span className="text-white font-semibold">{selectedForm.supplierDetails?.contactDetails || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Registration: </span>
                        <span className="text-white font-semibold">{selectedForm.supplierDetails?.companyRegistrationDetails || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Employees: </span>
                        <span className="text-white font-semibold">{selectedForm.supplierDetails?.employeeCount || "—"}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-slate-400">Business Activities: </span>
                        <span className="text-white font-semibold">{selectedForm.supplierDetails?.businessActivities || "—"}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-slate-400">Operating Locations: </span>
                        <span className="text-white font-semibold">{selectedForm.supplierDetails?.operatingLocations || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Information */}
                  <div className="border-t border-white/10 pt-4 space-y-4">
                    <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">
                      Compliance Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Environmental Policy: </span>
                        <span className="text-white font-semibold">
                          {selectedForm.complianceDetails?.environmentalPolicy ? "Yes" : "No"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">ESG Programme: </span>
                        <span className="text-white font-semibold">
                          {selectedForm.complianceDetails?.esgProgramme ? "Yes" : "No"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Health & Safety Policy: </span>
                        <span className="text-white font-semibold">
                          {selectedForm.complianceDetails?.healthSafetyPolicy ? "Yes" : "No"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">ISO Certification: </span>
                        <span className="text-white font-semibold">
                          {selectedForm.complianceDetails?.isoCertification || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Approval Information */}
                  <div className="border-t border-white/10 pt-4 space-y-4">
                    <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">
                      Approval Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Approved At: </span>
                        <span className="text-white font-semibold">
                          {selectedForm.approvedAt ? formatDate(selectedForm.approvedAt) : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Created At: </span>
                        <span className="text-white font-semibold">
                          {formatDate(selectedForm.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table Section - Only show when no form is selected */}
            {!selectedForm && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-2xl space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-sm text-slate-100">Loading forms…</div>
                  </div>
                ) : forms.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-slate-100">No approved forms found.</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr className="text-left text-slate-200 border-b border-white/10">
                            <th className="py-3 pr-4 font-semibold">Form Code</th>
                            <th className="py-3 pr-4 font-semibold">
                              Company Name
                            </th>
                            <th className="py-3 pr-4 font-semibold">Contact</th>
                            <th className="py-3 pr-4 font-semibold">Approved At</th>
                            <th className="py-3 pr-4 font-semibold">Status</th>
                            <th className="py-3 pr-4 font-semibold text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentForms.map((form) => (
                            <tr
                              key={form._id}
                              className="border-b border-white/5 hover:bg-white/5 transition"
                            >
                              <td className="py-3 pr-4">
                                <span className="font-mono text-sky-300">
                                  {form.formCode || "—"}
                                </span>
                              </td>
                              <td className="py-3 pr-4">
                                <div className="max-w-xs">
                                  <p className="text-slate-200">
                                    {form.supplierDetails?.inchargeNameAndCompany || "—"}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 pr-4">
                                {form.supplierDetails?.contactDetails || "—"}
                              </td>
                              <td className="py-3 pr-4">
                                {form.approvedAt ? formatDate(form.approvedAt) : formatDate(form.updatedAt)}
                              </td>
                              <td className="py-3 pr-4">
                                <span className="inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/50">
                                  {form.status || "Approved"}
                                </span>
                              </td>
                              <td className="py-3 pr-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedForm(form)}
                                  className="text-sky-400 hover:text-sky-300 transition text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded border border-sky-400/30 hover:bg-sky-400/10"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="text-xs text-slate-300">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(endIndex, forms.length)} of {forms.length}{" "}
                          approved forms
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-white/90 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            Previous
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                              .filter((page) => {
                                return (
                                  page === 1 ||
                                  page === totalPages ||
                                  (page >= currentPage - 1 &&
                                    page <= currentPage + 1)
                                );
                              })
                              .map((page, index, array) => {
                                const showEllipsisBefore =
                                  index > 0 && array[index - 1] !== page - 1;
                                return (
                                  <div key={page} className="flex items-center gap-1">
                                    {showEllipsisBefore && (
                                      <span className="text-slate-400 px-1">…</span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handlePageChange(page)}
                                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                                        currentPage === page
                                          ? "bg-orange-500 text-white border-orange-500"
                                          : "border-white/10 bg-white/5 text-white/90 hover:bg-white/10"
                                      }`}
                                    >
                                      {page}
                                    </button>
                                  </div>
                                );
                              })}
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-white/90 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

