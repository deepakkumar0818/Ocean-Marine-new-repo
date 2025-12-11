import { NextResponse } from "next/server";
import cloudinary from "@/lib/config/claudinary";
import { formatBufferTo64 } from "@/lib/upload/datauri";
import { connectDB } from "@/lib/config/connection";
import StsOperation from "@/lib/mongodb/models/StsOperation";
import mongoose from "mongoose";

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();

    const body = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") body[key] = value;
    });

    // File Fields
    const fileFields = [
      "jpo",
      "stblSSQ",
      "ssSSQ",
      "stblIndemnity",
      "ssIndemnity",
      "standingOrder",
      "stsEquipChecklistPriorOps",
      "stsEquipChecklistAfterOps",
      "checklist1",
      "checklist2",
      "checklist3AB",
      "checklist4AF",
      "checklist5AC",
      "checklist6AB",
      "checklist7",
      "stblMasterFeedback",
      "ssMasterFeedback",
      "stsTimesheet",
      "hourlyChecks",
      "incidentReporting",
    ];

    const uploadedFiles = {};

    // Basic file validation
    const MAX_SIZE_BYTES = 25 * 1024 * 1024; 
    const ALLOWED_TYPES = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    for (const field of fileFields) {
      const file = formData.get(field);
      if (file && typeof file !== "string") {
        if (file.size > MAX_SIZE_BYTES) {
          return NextResponse.json(
            { error: `${field} exceeds 25MB limit` },
            { status: 400 }
          );
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          return NextResponse.json(
            { error: `${field} type not allowed (${file.type})` },
            { status: 400 }
          );
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const file64 = formatBufferTo64({ originalname: file.name, buffer });

        const uploaded = await cloudinary.uploader.upload(file64, {
          folder: "oceane/sts",
        });

        uploadedFiles[field] = uploaded.secure_url;
      }
    }

    // Generate parentId for FIRST VERSION
    const parentId = new mongoose.Types.ObjectId();

    const newOperation = await StsOperation.create({
      ...body,
      ...uploadedFiles,
      parentOperationId: parentId,
      version: 1,
      isLatest: true,
    });

    return NextResponse.json(
      { message: "STS Operation Created", data: newOperation },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create STS Operation" },
      { status: 500 }
    );
  }
}
