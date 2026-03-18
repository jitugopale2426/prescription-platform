import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    currentIllness: {
      type: String,
      required: true,
    },
    recentSurgery: {
      type: String,
      default: "",
    },
    isDiabetic: {
      type: Boolean,
      default: false,
    },
    allergies: {
      type: String,
      default: "",
    },
    others: {
      type: String,
      default: "",
    },
    transactionId: {
      type: String,
      required: true,
    },
    // pending until doctor writes prescription
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Consultation", consultationSchema);
