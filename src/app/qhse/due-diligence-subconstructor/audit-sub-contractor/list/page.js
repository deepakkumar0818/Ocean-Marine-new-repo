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

export default function AuditSubContractorListPage() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedAudit, setSelectedAudit] = useState(null);

  const fetchAudits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "/api/qhse/due-diligence/audit-sub-contractor/list"
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load audit forms");
      }
      setAudits(data.subContractorAudits || []);
      if (selectedAudit) {
        const updated = data.subContractorAudits.find(
          (a) => a._id === selectedAudit._id
        );
        if (updated) setSelectedAudit(updated);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(audits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAudits = audits.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetails = (audit) => {
    setSelectedAudit(audit);
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
                  QHSE / Due Diligence / Audit Form - Sub Contractor
                </p>
                <h1 className="text-2xl font-bold">
                  Audit Form - Sub Contractor List
                </h1>
                <p className="text-xs text-slate-200 mt-1">
                  View all sub-contractor audit forms. Click "View Details" to
                  see full information.
                </p>
              </div>
            </div>
            {!selectedAudit && (
              <Link
                href="/qhse/due-diligence-subconstructor/audit-sub-contractor/form"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 transition"
              >
                + New Form
              </Link>
            )}
          </header>

          <main className="space-y-6">
            {/* Detail Card - Takes full space when audit is selected - Table is hidden when this is shown */}
            {selectedAudit && (
              <div className="w-full rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Audit Details
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        FORM CODE: <span className="font-mono text-sky-300">{selectedAudit.formCode || "—"}</span>
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                        selectedAudit.status === "Approved"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50"
                          : "bg-amber-500/20 text-amber-300 border border-amber-400/50"
                      }`}
                    >
                      {selectedAudit.status || "Draft"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAudit(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition text-white text-xl font-bold"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Sub-Contractor Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">
                      Sub-Contractor Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          SUB-CONTRACTOR NAME AND ADDRESS:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.subcontractorNameAndAddress || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          SERVICE TYPE:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.serviceType || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          CONTACT PERSON:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.contactPerson || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          EMAIL:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.emailOfContactPerson || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          PHONE:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.phoneOfContactPerson || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          OPERATING AREAS:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.operatingAreas || "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Information Section */}
                  <div className="border-t border-white/10 pt-4 space-y-4">
                    <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">
                      Compliance Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Trade License:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.tradeLicenseCopyAvailable ? "Yes" : "No"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          HSE Policy:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.hasHSEPolicy ? "Yes" : "No"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Audits Subcontractors:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.auditsSubcontractors ? "Yes" : "No"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Insurance:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.hasInsurance ? "Yes" : "No"}
                        </div>
                      </div>
                    </div>
                    {selectedAudit.hasInsurance && selectedAudit.insuranceDetails && (
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Insurance Details:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.insuranceDetails}
                        </div>
                      </div>
                    )}
                    {selectedAudit.isoCertifications &&
                      selectedAudit.isoCertifications.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-slate-400 block">
                            ISO Certifications:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {selectedAudit.isoCertifications.map((cert, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Audit Completed By Section */}
                  <div className="border-t border-white/10 pt-4 space-y-4">
                    <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">
                      Audit Completed By
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Name:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.auditCompletedBy?.name || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Designation:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.auditCompletedBy?.designation || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Signed At:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.auditCompletedBy?.signedAt
                            ? formatDate(selectedAudit.auditCompletedBy.signedAt)
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contractor Approved By Section */}
                  <div className="border-t border-white/10 pt-4 space-y-4">
                    <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">
                      Contractor Approved By
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Name:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.contractorApprovedBy?.name || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Designation:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.contractorApprovedBy?.designation || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Signed At:
                        </label>
                        <div className="text-sm font-semibold text-white">
                          {selectedAudit.contractorApprovedBy?.signedAt
                            ? formatDate(selectedAudit.contractorApprovedBy.signedAt)
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Table Section - Only show when no audit is selected */}
            {!selectedAudit && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-2xl space-y-4">
                {error && (
                  <p className="text-xs text-red-300 bg-red-950/40 border border-red-500/40 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-sm text-slate-100">Loading audits…</div>
                  </div>
                ) : audits.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-slate-100">
                      No audit forms found.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr className="text-left text-slate-200 border-b border-white/10">
                            <th className="py-3 pr-4 font-semibold">Form Code</th>
                            <th className="py-3 pr-4 font-semibold">
                              Sub-Contractor Name
                            </th>
                            <th className="py-3 pr-4 font-semibold">
                              Service Type
                            </th>
                            <th className="py-3 pr-4 font-semibold">
                              Contact Person
                            </th>
                            <th className="py-3 pr-4 font-semibold">Email</th>
                            <th className="py-3 pr-4 font-semibold">Status</th>
                            <th className="py-3 pr-4 font-semibold text-right">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentAudits.map((audit) => (
                            <tr
                              key={audit._id}
                              className="border-b border-white/5 hover:bg-white/5 transition"
                            >
                              <td className="py-3 pr-4">
                                <span className="font-mono text-sky-300">
                                  {audit.formCode || "—"}
                                </span>
                              </td>
                              <td className="py-3 pr-4">
                                <div className="max-w-xs">
                                  <p className="line-clamp-2 text-slate-200">
                                    {audit.subcontractorNameAndAddress || "—"}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 pr-4">
                                {audit.serviceType || "—"}
                              </td>
                              <td className="py-3 pr-4">
                                {audit.contactPerson || "—"}
                              </td>
                              <td className="py-3 pr-4">
                                {audit.emailOfContactPerson || "—"}
                              </td>
                              <td className="py-3 pr-4">
                                <span
                                  className={`inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                                    audit.status === "Approved"
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50"
                                      : "bg-amber-500/20 text-amber-300 border border-amber-400/50"
                                  }`}
                                >
                                  {audit.status || "Draft"}
                                </span>
                              </td>
                              <td className="py-3 pr-4 text-right">
                                <button
                                  type="button"
                                  className="text-sky-400 hover:text-sky-300 transition text-[10px] font-medium uppercase tracking-wider"
                                  onClick={() => handleViewDetails(audit)}
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
                          {Math.min(endIndex, audits.length)} of {audits.length}{" "}
                          audits
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

