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

    if (record.status !== "Draft") {
      return NextResponse.json(
        { error: "Only Draft records can be edited" },
        { status: 403 }
      );
    }

    delete body.status;
    delete body.approvedBy;
    delete body.approvedAt;
    delete body.formCode;

    Object.assign(record, body);
    await record.save();

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
