import mongoose, { Schema } from "mongoose";

const stsOperationSchema = new Schema(
  {
    // Versioning
    parentOperationId: { type: Schema.Types.ObjectId, required: true },
    version: { type: Number, default: 1 },
    isLatest: { type: Boolean, default: true },

    // GENERAL INFORMATION
    title: String,
    typeOfJob: String,
    operationStatus: String,

    location: { type: Schema.Types.ObjectId, ref: "Location" }, 
    dateOfJob: Date,

    stbl: String,
    sisterShip: String,

    mooringMaster: { type: Schema.Types.ObjectId, ref: "MooringMaster" }, 

    typeOfCargo: { type: Schema.Types.ObjectId, ref: "CargoType" },

    quantity: Number,

    // PRE-STS DOCUMENTS
    jpo: String,
    stblSSQ: String,
    ssSSQ: String,
    stblIndemnity: String,
    ssIndemnity: String,
    standingOrder: String,

    // STS EQUIPMENT
    stsEquipChecklistPriorOps: String,
    stsEquipChecklistAfterOps: String,

    // CHECKLISTS
    checklist1: String,
    checklist2: String,
    checklist3AB: String,
    checklist4AF: String,
    checklist5AC: String,
    checklist6AB: String,
    checklist7: String,

    // FEEDBACK
    stblMasterFeedback: String,
    ssMasterFeedback: String,
    workHours: String,

    // ATTACHMENTS
    stsTimesheet: String,
    hourlyChecks: String,
    incidentReporting: String,

    // EQUIPMENT + REMARKS
    equipmentUsed: String,
    remarks: String,

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.StsOperation ||
  mongoose.model("StsOperation", stsOperationSchema);
