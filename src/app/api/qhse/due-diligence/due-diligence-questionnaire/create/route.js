import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import SupplierDueDiligence from "@/lib/mongodb/models/SupplierDueDiligence";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const record = await SupplierDueDiligence.create({
    ...body,
    status: "Draft",
  });

  return NextResponse.json({ success: true, data: record }, { status: 201 });
}
