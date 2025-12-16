import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import EquipmentUsed from "@/lib/mongodb/models/EquipmentUsed";

export async function GET() {
  await connectDB();
  try {
    const equipmentUsed = await EquipmentUsed.find();
    return NextResponse.json({ equipmentUsed });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
