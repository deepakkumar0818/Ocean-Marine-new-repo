import { NextResponse } from "next/server";
import cloudinary from "@/lib/config/claudinary";
import { formatBufferTo64 } from "@/lib/upload/datauri";
import { connectDB } from "@/lib/config/connection";
import StsOperation from "@/lib/mongodb/models/StsOperation";

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const existing = await StsOperation.findById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Operation not found" },
        { status: 404 }
      );
    }

    if (!existing.isLatest) {
      return NextResponse.json(
        { error: "Only latest version can be updated" },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const body = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") body[key] = value;
    });

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
    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
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
            { error: `${field} exceeds 10MB limit` },
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

    // GET LAST VERSION OF THIS OPERATION
    const lastVersion = await StsOperation.findOne({
      parentOperationId: existing.parentOperationId,
    }).sort({ version: -1 });

    const newVersionNumber = Number((lastVersion.version + 0.1).toFixed(1));

    // Mark previous versions as NOT latest
    await StsOperation.updateMany(
      { parentOperationId: existing.parentOperationId },
      { $set: { isLatest: false } }
    );

    // CREATE NEW VERSION ENTRY
    const newVersion = await StsOperation.create({
      ...existing.toObject(),
      ...body,
      ...uploadedFiles,
      _id: undefined, // important: create new document, NOT overwrite
      version: newVersionNumber,
      isLatest: true,
    });

    return NextResponse.json({
      success: true,
      message: "New version created",
      data: newVersion,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
