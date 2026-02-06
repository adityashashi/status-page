import mongoose from "mongoose";

export default mongoose.model("Incident", new mongoose.Schema({
  orgId: { type: String, index: true },
  title: String,
  status: {
    type: String,
    enum: ["INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"],
    default: "INVESTIGATING"
  },
  serviceIds: [String],
  isMaintenance: Boolean,
  createdAt: Date,
  resolvedAt: Date
}));
