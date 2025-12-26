import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import SupplierDueDiligence from "@/lib/mongodb/models/SupplierDueDiligence";

export async function PUT(req, { params }) {
  await connectDB();

  try {
    const { id } = await params;

    const record = await SupplierDueDiligence.findById(id);

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    if (record.status !== "Draft") {
      return NextResponse.json(
        { error: "Only Draft forms can be submitted" },
        { status: 403 }
      );
    }

    if (
      !record.supplierDetails?.inchargeNameAndCompany ||
      !record.supplierDetails?.contactDetails
    ) {
      return NextResponse.json(
        { error: "Required supplier details are missing" },
        { status: 400 }
      );
    }

    record.status = "Submitted";
    await record.save();

    return NextResponse.json(
      {
        message: "Form submitted successfully",
        data: record,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
