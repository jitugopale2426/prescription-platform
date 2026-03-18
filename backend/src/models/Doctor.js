import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
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
    specialty: {
      type: String,
      required: true,
    },
    // years can be decimal like 1.5
    experience: {
      type: Number,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Doctor", doctorSchema);
