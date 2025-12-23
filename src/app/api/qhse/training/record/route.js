import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/connection";
import TrainingRecord from "@/lib/mongodb/models/TrainingRecord";
import TrainingPlan from "@/lib/mongodb/models/TrainingPlan";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      trainingPlanId,
      plannedDate,
      topic,
      instructor,
      actualTrainingDate,
      attendance,
    } = body;

    // Basic validation
    if (
      !trainingPlanId ||
      !plannedDate ||
      !topic ||
      !instructor ||
      !actualTrainingDate ||
      !attendance?.length
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure plan exists
    const plan = await TrainingPlan.findById(trainingPlanId);

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Training plan not found" },
        { status: 404 }
      );
    }

    // Check if the specific planItem (for this plannedDate) is approved
    const planItem = plan.planItems.find(
      (item) => new Date(item.plannedDate).toISOString().split("T")[0] === 
                 new Date(plannedDate).toISOString().split("T")[0]
    );

    if (!planItem) {
      return NextResponse.json(
        { success: false, error: "Plan item not found for this planned date" },
        { status: 404 }
      );
    }

    if (planItem.status !== "Approved") {
      return NextResponse.json(
        { success: false, error: "This plan item is not approved yet" },
        { status: 403 }
      );
    }

    // Prevent duplicate record for same plannedDate
    const existingRecord = await TrainingRecord.findOne({
      trainingPlanId,
      plannedDate,
    });

    if (existingRecord) {
      return NextResponse.json(
        { success: false, error: "Training record already exists" },
        { status: 409 }
      );
    }

    const record = await TrainingRecord.create({
      trainingPlanId,
      plannedDate,
      topic,
      instructor,
      actualTrainingDate,
      attendance,
      status: "Draft", 
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error("Create Training Record Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
