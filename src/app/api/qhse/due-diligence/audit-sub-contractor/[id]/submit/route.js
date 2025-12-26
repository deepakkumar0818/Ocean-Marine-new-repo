import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import SubContractorAudit from "@/lib/mongodb/models/SubContractorAudit";

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const subContractorAudit = await SubContractorAudit.findById(id);

    if (!subContractorAudit) {
      return NextResponse.json(
        { error: "Sub contractor audit not found" },
        { status: 404 }
      );
    }

    if (subContractorAudit.status !== "Draft") {
      return NextResponse.json(
        { error: "Only draft forms can be submitted" },
        { status: 403 }
      );
    }

    if (
      !subContractorAudit.subcontractorName?.trim() ||
      !subContractorAudit.subcontractorAddress?.trim() ||
      !subContractorAudit.serviceType?.trim() ||
      !subContractorAudit.contactPerson?.trim() ||
      !subContractorAudit.emailOfContactPerson?.trim() ||
      !subContractorAudit.phoneOfContactPerson?.trim()
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled before submission" },
        { status: 400 }
      );
    }

    if (
      typeof subContractorAudit.tradeLicenseCopyAvailable !== "boolean" ||
      typeof subContractorAudit.hasHSEPolicy !== "boolean" ||
      typeof subContractorAudit.auditsSubcontractors !== "boolean" ||
      typeof subContractorAudit.hasInsurance !== "boolean"
    ) {
      return NextResponse.json(
        { error: "All compliance questions must be answered" },
        { status: 400 }
      );
    }

    if (
      subContractorAudit.hasInsurance &&
      !subContractorAudit.insuranceDetails?.trim()
    ) {
      return NextResponse.json(
        { error: "Insurance details are required when insurance is selected" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(subContractorAudit.isoCertifications) ||
      subContractorAudit.isoCertifications.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one ISO certification must be selected" },
        { status: 400 }
      );
    }

    if (
      !subContractorAudit.auditCompletedBy?.name?.trim() ||
      !subContractorAudit.auditCompletedBy?.designation?.trim() ||
      !subContractorAudit.auditCompletedBy?.signedAt
    ) {
      return NextResponse.json(
        { error: "Audit completed by fields are required" },
        { status: 400 }
      );
    }

    if (
      !subContractorAudit.contractorApprovedBy?.name?.trim() ||
      !subContractorAudit.contractorApprovedBy?.designation?.trim() ||
      !subContractorAudit.contractorApprovedBy?.signedAt
    ) {
      return NextResponse.json(
        { error: "Contractor approved by fields are required" },
        { status: 400 }
      );
    }

    subContractorAudit.status = "Submitted";
    await subContractorAudit.save();

    return NextResponse.json(
      {
        message: "Sub contractor audit submitted successfully",
        data: subContractorAudit,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
