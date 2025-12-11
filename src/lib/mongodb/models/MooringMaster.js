import mongoose from "mongoose";

const mooringMasterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.MooringMaster ||
  mongoose.model("MooringMaster", mooringMasterSchema);
