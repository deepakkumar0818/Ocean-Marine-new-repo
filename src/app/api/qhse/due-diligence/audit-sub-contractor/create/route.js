import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import SubContractorAudit from "@/lib/mongodb/models/SubContractorAudit";

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const {
      subcontractorName,
      subcontractorAddress,
      serviceType,
      contactPerson,
      emailOfContactPerson,
      phoneOfContactPerson,
      operatingAreas,
      tradeLicenseCopyAvailable,
      hasHSEPolicy,
      auditsSubcontractors,
      hasInsurance,
      insuranceDetails,
      isoCertifications,
      auditCompletedBy,
      contractorApprovedBy,
    } = body;

    if (
      !subcontractorName?.trim() ||
      !subcontractorAddress?.trim() ||
      !serviceType?.trim() ||
      !contactPerson?.trim() ||
      !emailOfContactPerson?.trim() ||
      !phoneOfContactPerson?.trim()
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    if (
      typeof tradeLicenseCopyAvailable !== "boolean" ||
      typeof hasHSEPolicy !== "boolean" ||
      typeof auditsSubcontractors !== "boolean" ||
      typeof hasInsurance !== "boolean"
    ) {
      return NextResponse.json(
        { error: "All compliance questions must be answered (Yes/No)" },
        { status: 400 }
      );
    }

    if (hasInsurance && !insuranceDetails?.trim()) {
      return NextResponse.json(
        { error: "Insurance details are required when insurance is selected" },
        { status: 400 }
      );
    }

    if (!Array.isArray(isoCertifications) || isoCertifications.length === 0) {
      return NextResponse.json(
        { error: "At least one ISO certification must be selected" },
        { status: 400 }
      );
    }

    if (
      !auditCompletedBy?.name?.trim() ||
      !auditCompletedBy?.designation?.trim() ||
      !auditCompletedBy?.signedAt
    ) {
      return NextResponse.json(
        { error: "Audit completed by fields are required" },
        { status: 400 }
      );
    }

    if (
      !contractorApprovedBy?.name?.trim() ||
      !contractorApprovedBy?.designation?.trim() ||
      !contractorApprovedBy?.signedAt
    ) {
      return NextResponse.json(
        { error: "Contractor approved by fields are required" },
        { status: 400 }
      );
    }

    const newSubContractorAudit = await new SubContractorAudit({
      subcontractorName,
      subcontractorAddress,
      serviceType,
      contactPerson,
      emailOfContactPerson,
      phoneOfContactPerson,
      operatingAreas,
      tradeLicenseCopyAvailable,
      hasHSEPolicy,
      auditsSubcontractors,
      hasInsurance,
      insuranceDetails,
      isoCertifications,
      auditCompletedBy,
      contractorApprovedBy,
      status: "Draft",
      createdBy: req.user?.id || null,
    }).save();
    return NextResponse.json(
      {
        message: "Sub contractor audit created successfully",
        data: newSubContractorAudit,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
