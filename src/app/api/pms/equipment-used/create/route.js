import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import EquipmentUsed from "@/lib/mongodb/models/EquipmentUsed";

export async function POST(req) {
  await connectDB();

  try {
    const { equipmentName, retirementDate } = await req.json();

    // Validation
    if (!equipmentName) {
      return NextResponse.json(
        { error: "Equipment name is required" },
        { status: 400 }
      );
    }

    if (!retirementDate) {
      return NextResponse.json(
        { error: "Retirement date is required" },
        { status: 400 }
      );
    }

    const existing = await EquipmentUsed.findOne({ equipmentName });
    if (existing) {
      return NextResponse.json(
        { error: "Equipment already exists" },
        { status: 400 }
      );
    }

    // Create equipment with SYSTEM defaults
    const equipment = await EquipmentUsed.create({
      equipmentName,
      retirementDate: new Date(retirementDate),

      availabilityStatus: "AVAILABLE",
      currentOperation: null,
      totalUsedHours: 0,
    });

    return NextResponse.json(
      {
        message: "Equipment created successfully",
        data: equipment,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
