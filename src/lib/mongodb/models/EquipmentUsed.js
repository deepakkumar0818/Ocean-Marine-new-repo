import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    equipmentName: {
      type: String,
      required: true,
    },

    retirementDate: {
      type: Date,
      required: true,
    },

    availabilityStatus: {
      type: String,
      enum: ["AVAILABLE", "IN_USE", "RETIRED"],
      default: "AVAILABLE",
    },

    currentOperation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StsOperation",
      default: null,
    },

    totalUsedHours: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.EquipmentUsed ||
  mongoose.model("EquipmentUsed", equipmentSchema);
