import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import EquipmentUsed from "@/lib/mongodb/models/EquipmentUsed";

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const item = await EquipmentUsed.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: "Equipment used not found" },
        { status: 404 }
      );
    }
    await EquipmentUsed.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Equipment used deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
