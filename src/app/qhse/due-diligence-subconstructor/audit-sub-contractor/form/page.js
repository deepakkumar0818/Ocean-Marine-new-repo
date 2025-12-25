"use client";

import { useState } from "react";
import Link from "next/link";
import QhseSidebar from "../../../components/QhseSidebar";

const ISO_CERTIFICATIONS = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "ISO 27001",
  "Other",
];

export default function AuditSubContractorFormPage() {
  const [form, setForm] = useState({
    subcontractorNameAndAddress: "",
    serviceType: "",
    contactPerson: "",
    emailOfContactPerson: "",
    phoneOfContactPerson: "",
    operatingAreas: "",
    tradeLicenseCopyAvailable: false,
    hasHSEPolicy: false,
    auditsSubcontractors: false,
    hasInsurance: false,
    insuranceDetails: "",
    isoCertifications: [],
    auditCompletedBy: {
      name: "",
      designation: "",
      signedAt: "",
    },
    contractorApprovedBy: {
      name: "",
      designation: "",
      signedAt: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleISOChange = (cert) => {
    setForm((prev) => ({
      ...prev,
      isoCertifications: prev.isoCertifications.includes(cert)
        ? prev.isoCertifications.filter((c) => c !== cert)
        : [...prev.isoCertifications, cert],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Format dates and ensure boolean fields are properly set
      const payload = {
        subcontractorNameAndAddress: form.subcontractorNameAndAddress.trim(),
        serviceType: form.serviceType.trim(),
        contactPerson: form.contactPerson.trim(),
        emailOfContactPerson: form.emailOfContactPerson.trim(),
        phoneOfContactPerson: form.phoneOfContactPerson.trim(),
        operatingAreas: form.operatingAreas?.trim() || "",
        tradeLicenseCopyAvailable: form.tradeLicenseCopyAvailable === true,
        hasHSEPolicy: form.hasHSEPolicy === true,
        auditsSubcontractors: form.auditsSubcontractors === true,
        hasInsurance: form.hasInsurance === true,
        insuranceDetails: form.hasInsurance ? (form.insuranceDetails?.trim() || "") : "",
        isoCertifications: form.isoCertifications || [],
        auditCompletedBy: {
          name: form.auditCompletedBy.name?.trim() || "",
          designation: form.auditCompletedBy.designation?.trim() || "",
          signedAt: form.auditCompletedBy.signedAt
            ? new Date(form.auditCompletedBy.signedAt)
            : undefined,
        },
        contractorApprovedBy: {
          name: form.contractorApprovedBy.name?.trim() || "",
          designation: form.contractorApprovedBy.designation?.trim() || "",
          signedAt: form.contractorApprovedBy.signedAt
            ? new Date(form.contractorApprovedBy.signedAt)
            : undefined,
        },
        status: "Draft",
      };

      const res = await fetch(
        "/api/qhse/due-diligence/audit-sub-contractor/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create audit form");
      }

      setSuccess("Audit form created successfully!");
      // Reset form
      setForm({
        subcontractorNameAndAddress: "",
        serviceType: "",
        contactPerson: "",
        emailOfContactPerson: "",
        phoneOfContactPerson: "",
        operatingAreas: "",
        tradeLicenseCopyAvailable: false,
        hasHSEPolicy: false,
        auditsSubcontractors: false,
        hasInsurance: false,
        insuranceDetails: "",
        isoCertifications: [],
        auditCompletedBy: {
          name: "",
          designation: "",
          signedAt: "",
        },
        contractorApprovedBy: {
          name: "",
          designation: "",
          signedAt: "",
        },
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex">
      <QhseSidebar />

      <div className="flex-1 ml-72">
        <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
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
                  Audit Form - Sub Contractor
                </h1>
                <p className="text-xs text-slate-200 mt-1">
                  Create a new sub-contractor audit form
                </p>
              </div>
            </div>
            <Link
              href="/qhse/due-diligence-subconstructor/audit-sub-contractor/list"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 transition"
            >
              View List
            </Link>
          </header>

          <main>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md shadow-2xl p-6 space-y-6"
            >
              {error && (
                <div className="text-xs text-red-300 bg-red-950/40 border border-red-500/40 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 rounded-lg px-3 py-2">
                  {success}
                </div>
              )}

              {/* Sub-Contractor Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                  Sub-Contractor Details
                </h2>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 block">
                    Name of Sub-Contractor & Address{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="subcontractorNameAndAddress"
                    value={form.subcontractorNameAndAddress}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
                    placeholder="Enter sub-contractor name and address"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 block">
                    Type of service offered:{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter service type"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 block">
                    Contact Person: <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter contact person name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 block">
                    Contact Number & Email ID{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      name="phoneOfContactPerson"
                      value={form.phoneOfContactPerson}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Contact Number"
                    />
                    <input
                      type="email"
                      name="emailOfContactPerson"
                      value={form.emailOfContactPerson}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Email ID"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 block">
                    Operating Area(s):
                  </label>
                  <input
                    type="text"
                    name="operatingAreas"
                    value={form.operatingAreas}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter operating areas"
                  />
                </div>
              </div>

              {/* Compliance Questions */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                  Compliance Questions
                </h2>

                <div className="space-y-4">
                  {/* Company Trade License Copy? */}
                  <div className="space-y-2">
                    <label className="text-sm text-white block">
                      Company Trade License Copy?{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tradeLicenseCopyAvailable"
                          value="true"
                          checked={form.tradeLicenseCopyAvailable === true}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              tradeLicenseCopyAvailable: true,
                            }))
                          }
                          className="h-4 w-4 text-sky-500 focus:ring-sky-500"
                          required
                        />
                        <span className="text-sm text-white">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tradeLicenseCopyAvailable"
                          value="false"
                          checked={form.tradeLicenseCopyAvailable === false}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              tradeLicenseCopyAvailable: false,
                            }))
                          }
                          className="h-4 w-4 text-sky-500 focus:ring-sky-500"
                        />
                        <span className="text-sm text-white">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Does Company have HSE Policy? */}
                  <div className="space-y-2">
                    <label className="text-sm text-white block">
                      Does Company have HSE Policy?{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="hasHSEPolicy"
                          value="true"
                          checked={form.hasHSEPolicy === true}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              hasHSEPolicy: true,
                            }))
                          }
                          className="h-4 w-4 text-sky-500 focus:ring-sky-500"
                          required
                        />
                        <span className="text-sm text-white">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="hasHSEPolicy"
                          value="false"
                          checked={form.hasHSEPolicy === false}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              hasHSEPolicy: false,
                            }))
                          }
                          className="h-4 w-4 text-sky-500 focus:ring-sky-500"
                        />
                        <span className="text-sm text-white">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Do you audit your supplier and sub-contractors? */}
                  <div className="space-y-2">
                    <label className="text-sm text-white block">
                      Do you audit your supplier and sub-contractors?{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="auditsSubcontractors"
                          value="true"
                          checked={form.auditsSubcontractors === true}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              auditsSubcontractors: true,
                            }))
                          }
                          className="h-4 w-4 text-sky-500 focus:ring-sky-500"
                          required
                        />
                        <span className="text-sm text-white">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="auditsSubcontractors"
                          value="false"
                          checked={form.auditsSubcontractors === false}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              auditsSubcontractors: false,
                            }))
                          }
                          className="h-4 w-4 text-sky-500 focus:ring-sky-500"
                        />
                        <span className="text-sm text-white">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Does company have appropriate insurance */}
                  <div className="space-y-2">
                    <label className="text-sm text-white block">
                      Does company have appropriate insurance: Employee, Public
                      Liability, PI? <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="hasInsurance"
                          value="true"
                          checked={form.hasInsurance === true}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              hasInsurance: true,
                            }))
                          }
                          className="h-4 w-4 text-sky-500 focus:ring-sky-500"
                          required
                        />
                        <span className="text-sm text-white">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="hasInsurance"
                          value="false"
                          checked={form.hasInsurance === false}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              hasInsurance: false,
                            }))
                          }
                          className="h-4 w-4 text-sky-500 focus:ring-sky-500"
                        />
                        <span className="text-sm text-white">No</span>
                      </label>
                    </div>
                  </div>

                  {form.hasInsurance && (
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-slate-400 block">
                        Insurance Details{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="insuranceDetails"
                        value={form.insuranceDetails}
                        onChange={handleChange}
                        required={form.hasInsurance}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="e.g., Employee / Public Liability / PI"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm text-white block">
                      What are the ISO Certifications the company is holding
                      (ISO 9001, ISO 14001, ISO 45001){" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ISO_CERTIFICATIONS.map((cert) => (
                        <label
                          key={cert}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.isoCertifications.includes(cert)}
                            onChange={() => handleISOChange(cert)}
                            className="h-4 w-4 rounded border-white/20 bg-white/5 text-sky-500 focus:ring-sky-500"
                          />
                          <span className="text-sm text-white">{cert}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Use */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                  Office Use
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">
                      Audit Completed By
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="auditCompletedBy.name"
                          value={form.auditCompletedBy.name}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Designation <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="auditCompletedBy.designation"
                          value={form.auditCompletedBy.designation}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Signed At <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          name="auditCompletedBy.signedAt"
                          value={form.auditCompletedBy.signedAt}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">
                      Contractor Approved By
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="contractorApprovedBy.name"
                          value={form.contractorApprovedBy.name}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Designation <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="contractorApprovedBy.designation"
                          value={form.contractorApprovedBy.designation}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-slate-400 block">
                          Signed At <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          name="contractorApprovedBy.signedAt"
                          value={form.contractorApprovedBy.signedAt}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-xs text-slate-400">
                  Status: <span className="text-amber-300">Draft</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold uppercase tracking-wider transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30"
                >
                  {submitting ? "Submitting..." : "Submit Form"}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

