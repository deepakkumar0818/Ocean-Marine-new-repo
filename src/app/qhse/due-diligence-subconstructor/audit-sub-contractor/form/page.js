"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import QhseSidebar from "../../../components/QhseSidebar";

const ISO_CERTIFICATIONS = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "ISO 27001",
  "Other",
];

export default function AuditSubContractorFormPage() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    subcontractorName: "",
    subcontractorAddress: "",
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);

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

  useEffect(() => {
    const editParam = searchParams?.get("edit");
    if (editParam) {
      setEditId(editParam);
      fetchFormData(editParam);
    }
  }, [searchParams]);

  const fetchFormData = async (id) => {
    try {
      const res = await fetch(`/api/qhse/due-diligence/audit-sub-contractor/list`);
      const data = await res.json();
      if (res.ok && data.subContractorAudits) {
        const audit = data.subContractorAudits.find((a) => a._id === id);
        if (audit && audit.status === "Draft") {
          setForm({
            subcontractorName: audit.subcontractorName || "",
            subcontractorAddress: audit.subcontractorAddress || "",
            serviceType: audit.serviceType || "",
            contactPerson: audit.contactPerson || "",
            emailOfContactPerson: audit.emailOfContactPerson || "",
            phoneOfContactPerson: audit.phoneOfContactPerson || "",
            operatingAreas: audit.operatingAreas || "",
            tradeLicenseCopyAvailable: audit.tradeLicenseCopyAvailable || false,
            hasHSEPolicy: audit.hasHSEPolicy || false,
            auditsSubcontractors: audit.auditsSubcontractors || false,
            hasInsurance: audit.hasInsurance || false,
            insuranceDetails: audit.insuranceDetails || "",
            isoCertifications: audit.isoCertifications || [],
            auditCompletedBy: {
              name: audit.auditCompletedBy?.name || "",
              designation: audit.auditCompletedBy?.designation || "",
              signedAt: audit.auditCompletedBy?.signedAt
                ? new Date(audit.auditCompletedBy.signedAt).toISOString().split("T")[0]
                : "",
            },
            contractorApprovedBy: {
              name: audit.contractorApprovedBy?.name || "",
              designation: audit.contractorApprovedBy?.designation || "",
              signedAt: audit.contractorApprovedBy?.signedAt
                ? new Date(audit.contractorApprovedBy.signedAt).toISOString().split("T")[0]
                : "",
            },
          });
        }
      }
    } catch (err) {
      setError("Failed to load form data");
    }
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        subcontractorName: form.subcontractorName.trim(),
        subcontractorAddress: form.subcontractorAddress.trim(),
        serviceType: form.serviceType.trim(),
        contactPerson: form.contactPerson.trim(),
        emailOfContactPerson: form.emailOfContactPerson.trim(),
        phoneOfContactPerson: form.phoneOfContactPerson.trim(),
        operatingAreas: form.operatingAreas?.trim() || "",
        tradeLicenseCopyAvailable: form.tradeLicenseCopyAvailable === true,
        hasHSEPolicy: form.hasHSEPolicy === true,
        auditsSubcontractors: form.auditsSubcontractors === true,
        hasInsurance: form.hasInsurance === true,
        insuranceDetails: form.hasInsurance
          ? form.insuranceDetails?.trim() || ""
          : "",
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

      let res;
      if (editId) {
        res = await fetch(
          `/api/qhse/due-diligence/audit-sub-contractor/${editId}/update`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch(
          "/api/qhse/due-diligence/audit-sub-contractor/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save draft");
      }

      setSuccess("✅ Form saved as draft successfully!");
      setError("");
      
      if (!editId && data.data?._id) {
        setEditId(data.data._id);
        window.history.replaceState({}, '', `/qhse/due-diligence-subconstructor/audit-sub-contractor/form?edit=${data.data._id}`);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setSuccess("");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (!form.subcontractorName?.trim()) {
        setError("Sub-contractor name is required");
        setSubmitting(false);
        return;
      }
      if (!form.subcontractorAddress?.trim()) {
        setError("Sub-contractor address is required");
        setSubmitting(false);
        return;
      }
      if (!form.serviceType?.trim()) {
        setError("Service type is required");
        setSubmitting(false);
        return;
      }
      if (!form.contactPerson?.trim()) {
        setError("Contact person is required");
        setSubmitting(false);
        return;
      }
      if (!form.emailOfContactPerson?.trim()) {
        setError("Email is required");
        setSubmitting(false);
        return;
      }
      if (!form.phoneOfContactPerson?.trim()) {
        setError("Phone number is required");
        setSubmitting(false);
        return;
      }
      if (typeof form.tradeLicenseCopyAvailable !== "boolean") {
        setError("Please answer the trade license question");
        setSubmitting(false);
        return;
      }
      if (typeof form.hasHSEPolicy !== "boolean") {
        setError("Please answer the HSE Policy question");
        setSubmitting(false);
        return;
      }
      if (typeof form.auditsSubcontractors !== "boolean") {
        setError("Please answer the audit question");
        setSubmitting(false);
        return;
      }
      if (typeof form.hasInsurance !== "boolean") {
        setError("Please answer the insurance question");
        setSubmitting(false);
        return;
      }
      if (form.hasInsurance && !form.insuranceDetails?.trim()) {
        setError("Insurance details are required when insurance is selected");
        setSubmitting(false);
        return;
      }
      if (!Array.isArray(form.isoCertifications) || form.isoCertifications.length === 0) {
        setError("At least one ISO certification must be selected");
        setSubmitting(false);
        return;
      }
      if (!form.auditCompletedBy?.name?.trim()) {
        setError("Audit completed by name is required");
        setSubmitting(false);
        return;
      }
      if (!form.auditCompletedBy?.designation?.trim()) {
        setError("Audit completed by designation is required");
        setSubmitting(false);
        return;
      }
      if (!form.auditCompletedBy?.signedAt) {
        setError("Audit completed by signed date is required");
        setSubmitting(false);
        return;
      }
      if (!form.contractorApprovedBy?.name?.trim()) {
        setError("Contractor approved by name is required");
        setSubmitting(false);
        return;
      }
      if (!form.contractorApprovedBy?.designation?.trim()) {
        setError("Contractor approved by designation is required");
        setSubmitting(false);
        return;
      }
      if (!form.contractorApprovedBy?.signedAt) {
        setError("Contractor approved by signed date is required");
        setSubmitting(false);
        return;
      }

      // Format dates and ensure boolean fields are properly set
      const payload = {
        subcontractorName: form.subcontractorName.trim(),
        subcontractorAddress: form.subcontractorAddress.trim(),
        serviceType: form.serviceType.trim(),
        contactPerson: form.contactPerson.trim(),
        emailOfContactPerson: form.emailOfContactPerson.trim(),
        phoneOfContactPerson: form.phoneOfContactPerson.trim(),
        operatingAreas: form.operatingAreas?.trim() || "",
        tradeLicenseCopyAvailable: form.tradeLicenseCopyAvailable === true,
        hasHSEPolicy: form.hasHSEPolicy === true,
        auditsSubcontractors: form.auditsSubcontractors === true,
        hasInsurance: form.hasInsurance === true,
        insuranceDetails: form.hasInsurance
          ? form.insuranceDetails?.trim() || ""
          : "",
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

      let formId = editId;

      // First save/create the form
      if (editId) {
        const updateRes = await fetch(
          `/api/qhse/due-diligence/audit-sub-contractor/${editId}/update`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const updateData = await updateRes.json();
        if (!updateRes.ok) {
          throw new Error(updateData.error || "Failed to update form");
        }
      } else {
        const createRes = await fetch(
          "/api/qhse/due-diligence/audit-sub-contractor/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const createData = await createRes.json();
        if (!createRes.ok) {
          throw new Error(createData.error || "Failed to create form");
        }
        formId = createData.data._id;
      }

      // Then submit it
      const submitRes = await fetch(
        `/api/qhse/due-diligence/audit-sub-contractor/${formId}/submit`,
        {
          method: "PUT",
        }
      );

      const submitData = await submitRes.json();

      if (!submitRes.ok) {
        throw new Error(submitData.error || "Failed to submit form");
      }

      // Show prominent success message
      setSuccess("✅ Audit form submitted successfully! Redirecting to list...");
      setError("");

      // Reset form
      setForm({
        subcontractorName: "",
        subcontractorAddress: "",
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

      if (editId) {
        window.history.replaceState({}, '', '/qhse/due-diligence-subconstructor/audit-sub-contractor/form');
      }

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Redirect to list page after 2 seconds
      setTimeout(() => {
        window.location.href =
          "/qhse/due-diligence-subconstructor/audit-sub-contractor/list-user";
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setSuccess("");
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
                  {editId && <span className="text-sm text-slate-400 ml-2">(Editing)</span>}
                </h1>
                <p className="text-xs text-slate-200 mt-1">
                  {editId ? "Edit your draft form. You can save changes or submit it." : "Create a new sub-contractor audit form"}
                </p>
              </div>
            </div>
            <Link
              href="/qhse/due-diligence-subconstructor/audit-sub-contractor/list-user"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 transition"
            >
              My Forms
            </Link>
          </header>

          <main>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md shadow-2xl p-6 space-y-6"
            >
              {error && (
                <div className="text-sm text-red-300 bg-red-950/40 border border-red-500/40 rounded-lg px-4 py-3 flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="text-base text-emerald-300 bg-emerald-950/40 border-2 border-emerald-500/60 rounded-lg px-6 py-4 flex items-center gap-3 shadow-lg shadow-emerald-500/20">
                  <span className="text-2xl">✅</span>
                  <span className="font-semibold">{success}</span>
                </div>
              )}

              {/* Sub-Contractor Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                  Sub-Contractor Details
                </h2>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 block">
                    Name of Sub-Contractor{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="subcontractorName"
                    value={form.subcontractorName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter sub-contractor name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 block">
                    Address of Sub-Contractor{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="subcontractorAddress"
                    value={form.subcontractorAddress}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y min-h-[100px]"
                    placeholder="Enter sub-contractor address"
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
                    Contact Number{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneOfContactPerson"
                    value={form.phoneOfContactPerson}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter contact number"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 block">
                    Email ID{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailOfContactPerson"
                    value={form.emailOfContactPerson}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter email ID"
                  />
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
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saving || submitting}
                  className="px-6 py-2.5 rounded-lg bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold uppercase tracking-wider transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save as Draft"}
                </button>
                <button
                  type="submit"
                  disabled={submitting || saving}
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
