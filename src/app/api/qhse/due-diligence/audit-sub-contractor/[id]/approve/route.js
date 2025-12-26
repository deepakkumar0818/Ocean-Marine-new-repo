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

    // Only Submitted forms can be approved
    if (subContractorAudit.status !== "Submitted") {
      return NextResponse.json(
        { error: "Only submitted forms can be approved" },
        { status: 403 }
      );
    }

    subContractorAudit.status = "Approved";
    await subContractorAudit.save();

    return NextResponse.json(
      {
        message: "Sub contractor audit approved successfully",
        data: subContractorAudit,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
