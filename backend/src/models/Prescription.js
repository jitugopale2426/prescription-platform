import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    careToBeTaken: {
      type: String,
      required: true,
    },
    medicines: {
      type: String,
      default: "",
    },
    // pdf file path after generation
    pdfPath: {
      type: String,
      default: "",
    },
    isSentToPatient: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Prescription", prescriptionSchema);
