import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import SubContractorAudit from "@/lib/mongodb/models/SubContractorAudit";

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await req.json();

    const subContractorAudit = await SubContractorAudit.findById(id);
    if (!subContractorAudit) {
      return NextResponse.json(
        { error: "Sub contractor audit not found" },
        { status: 404 }
      );
    }

    if (subContractorAudit.status !== "Draft") {
      return NextResponse.json(
        { error: "Only draft forms can be updated" },
        { status: 403 }
      );
    }

    delete body.status;
    delete body.approvedBy;
    delete body.approvedAt;
    delete body.formCode;
    delete body.createdBy;
    delete body.createdAt;

    if (
      body.subcontractorName !== undefined &&
      !body.subcontractorName?.trim()
    ) {
      return NextResponse.json(
        { error: "Sub-contractor name is required" },
        { status: 400 }
      );
    }
    if (
      body.subcontractorAddress !== undefined &&
      !body.subcontractorAddress?.trim()
    ) {
      return NextResponse.json(
        { error: "Sub-contractor address is required" },
        { status: 400 }
      );
    }
    if (body.serviceType !== undefined && !body.serviceType?.trim()) {
      return NextResponse.json(
        { error: "Service type is required" },
        { status: 400 }
      );
    }
    if (body.contactPerson !== undefined && !body.contactPerson?.trim()) {
      return NextResponse.json(
        { error: "Contact person is required" },
        { status: 400 }
      );
    }
    if (
      body.emailOfContactPerson !== undefined &&
      !body.emailOfContactPerson?.trim()
    ) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (
      body.phoneOfContactPerson !== undefined &&
      !body.phoneOfContactPerson?.trim()
    ) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (
      body.tradeLicenseCopyAvailable !== undefined &&
      typeof body.tradeLicenseCopyAvailable !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Trade license answer must be a boolean" },
        { status: 400 }
      );
    }
    if (
      body.hasHSEPolicy !== undefined &&
      typeof body.hasHSEPolicy !== "boolean"
    ) {
      return NextResponse.json(
        { error: "HSE Policy answer must be a boolean" },
        { status: 400 }
      );
    }
    if (
      body.auditsSubcontractors !== undefined &&
      typeof body.auditsSubcontractors !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Audit answer must be a boolean" },
        { status: 400 }
      );
    }
    if (
      body.hasInsurance !== undefined &&
      typeof body.hasInsurance !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Insurance answer must be a boolean" },
        { status: 400 }
      );
    }

    // Validate insurance details if insurance is selected
    if (
      body.hasInsurance === true &&
      body.insuranceDetails !== undefined &&
      !body.insuranceDetails?.trim()
    ) {
      return NextResponse.json(
        { error: "Insurance details are required when insurance is selected" },
        { status: 400 }
      );
    }

    // Validate ISO certifications
    if (body.isoCertifications !== undefined) {
      if (
        !Array.isArray(body.isoCertifications) ||
        body.isoCertifications.length === 0
      ) {
        return NextResponse.json(
          { error: "At least one ISO certification must be selected" },
          { status: 400 }
        );
      }
    }

    Object.assign(subContractorAudit, body);
    await subContractorAudit.save();

    return NextResponse.json(
      { success: true, data: subContractorAudit },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
