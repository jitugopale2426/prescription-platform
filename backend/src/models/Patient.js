import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    historyOfSurgery: {
      type: String,
      default: "",
    },
    // illnesses stored as array, split by comma on frontend
    historyOfIllness: {
      type: [String],
      default: [],
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Patient", patientSchema);
