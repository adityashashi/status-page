import mongoose from "mongoose";

export default mongoose.model("Service", new mongoose.Schema({
  orgId: { type: String, index: true },
  name: String,
  status: {
    type: String,
    enum: ["OPERATIONAL", "DEGRADED", "PARTIAL_OUTAGE", "MAJOR_OUTAGE"],
    default: "OPERATIONAL"
  },
  updatedAt: Date
}));
