import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import SupplierDueDiligence from "@/lib/mongodb/models/SupplierDueDiligence";

export async function PUT(req, { params }) {
  await connectDB();

  try {
    const { id } = await params;
    const body = await req.json();

    const record = await SupplierDueDiligence.findById(id);

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    if (record.status !== "Submitted") {
      return NextResponse.json(
        { error: "Only submitted forms can be approved" },
        { status: 403 }
      );
    }

    record.status = "Approved";
    record.approvedBy = body.approvedBy;
    record.approvedAt = new Date();

    await record.save();

    return NextResponse.json(
      {
        message: "Supplier Due Diligence approved successfully",
        data: record,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
