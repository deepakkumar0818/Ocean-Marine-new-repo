import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SubContractorAudit from "@/lib/mongodb/models/SubContractorAudit";

export async function PUT(req, { params }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const subContractorAudit = await SubContractorAudit.findById(id);
    if (!subContractorAudit) {
      return NextResponse.json(
        { error: "Sub contractor audit not found" },
        { status: 404 }
      );
    }

    if (subContractorAudit.status === "Approved") {
      return NextResponse.json(
        { error: "Sub contractor audit is already approved" },
        { status: 400 }
      );
    }
    subContractorAudit.status = "Approved";
    await subContractorAudit.save();
    return NextResponse.json(
      {
        message: "Sub contractor audit updated successfully",
        data: subContractorAudit,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
