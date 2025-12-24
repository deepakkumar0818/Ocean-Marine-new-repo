import mongoose from "mongoose";

const equipmentUsageSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentUsed",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
    },

    usedHours: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["IN_USE", "RELEASED"],
      default: "IN_USE",
    },
  },
  { _id: false }
);

const stsOperationSchema = new mongoose.Schema(
  {
    parentOperationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    version: { type: Number, default: 1 },
    isLatest: { type: Boolean, default: true },

    Operation_Ref_No: {
      type: String,
      required: true,
      index: true,
    },

    typeOfOperation: String,
    mooringMaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MooringMaster",
    },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    client: String,

    operationStatus: {
      type: String,
      enum: ["INPROGRESS", "COMPLETED", "CANCELED", "PENDING"],
      default: "INPROGRESS",
    },

    operationStartTime: {
      type: Date,
      required: true,
    },
    operationEndTime: {
      type: Date,
    },

    flowDirection: {
      type: String,
      enum: ["left", "right", "both"],
      default: "left",
    },

    quantity: Number,
    typeOfCargo: { type: mongoose.Schema.Types.ObjectId, ref: "CargoType" },

    equipments: [equipmentUsageSchema],

    chs: String,
    chsSSQ: String,
    chsQ88: String,
    chsGAPlan: String,
    chsMSDS: String,
    chsMooringArrangement: String,
    chsIndemnity: String,

    ms: String,
    msSSQ: String,
    msQ88: String,
    msGAPlan: String,
    msMSDS: String,
    msMooringArrangement: String,
    msIndemnity: String,

    jpo: String,
    riskAssessment: String,
    mooringPlan: String,

    DeclarationAtSea: String,

    checklist1: String,
    checklist2: String,
    checklist3AB: String,
    checklist4AF: String,
    checklist5AC: String,
    checklist6AB: String,
    checklist7: String,

    stsTimesheet: String,
    standingOrder: String,
    stsEquipChecklistPriorOps: String,
    stsEquipChecklistAfterOps: String,

    chsFeedback: String,
    msFeedback: String,
    hourlyChecks: String,
    restHoursCKL: String,

    incidentReporting: String,
    remarks: String,

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.StsOperation ||
  mongoose.model("StsOperation", stsOperationSchema);
