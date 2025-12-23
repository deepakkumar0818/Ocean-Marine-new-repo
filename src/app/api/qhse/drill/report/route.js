import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import DrillReport from "@/lib/mongodb/models/DrillReport";
import DrillPlan from "@/lib/mongodb/models/DrillPlan";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      drillPlanId,
      drillNo,
      drillDate,
      location,
      drillScenario,
      participants,
      incidentProgression,
      year,
      quarter,
    } = body;

    // Basic validation
    if (
      !drillNo ||
      !drillDate ||
      !drillScenario ||
      !participants?.length
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate participants
    const validParticipants = participants.filter(
      (p) => p.name?.trim() && p.role?.trim()
    );

    if (validParticipants.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one participant with name and role is required" },
        { status: 400 }
      );
    }

    // If drillPlanId is provided, verify the plan exists
    if (drillPlanId) {
      const plan = await DrillPlan.findById(drillPlanId);

      if (!plan) {
        return NextResponse.json(
          { success: false, error: "Drill plan not found" },
          { status: 404 }
        );
      }
    }

    const report = await DrillReport.create({
      drillPlanId: drillPlanId || null,
      drillNo: drillNo.trim(),
      drillDate: new Date(drillDate),
      location: location?.trim() || "",
      drillScenario: drillScenario.trim(),
      participants: validParticipants,
      incidentProgression: incidentProgression?.trim() || "",
      year: year ? Number.parseInt(year, 10) : new Date(drillDate).getFullYear(),
      quarter: quarter || null,
      status: "Draft",
    });

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error) {
    console.error("Create Drill Report Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}