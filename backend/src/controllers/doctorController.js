import Doctor from "../models/Doctor.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerDoctorController = async (req, res) => {
  try {
    const { name, email, password, phone, specialty, experience } = req.body;

    if(!name || !email || !password || !phone || !specialty || !experience){
        return res.status(400).json({ message: "All fields are required" })
    }

    const existingDoctor = await Doctor.findOne({ email })
    if (existingDoctor) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const existingPhone = await Doctor.findOne({ phone })
    if (existingPhone) {
      return res.status(400).json({ message: "Phone already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const doctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      phone,
      specialty,
      experience,
      profilePicture: req.file ? req.file.filename : ""
    })

    await doctor.save()

    res.status(201).json({ message: "Doctor registered successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const loginDoctorController = async (req, res) => {
  try {
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({ message: "All fields are required" })
    }

    const doctor = await Doctor.findOne({ email })
    if (!doctor) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        experience: doctor.experience,
        profilePicture: doctor.profilePicture
      }
    })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getDoctorProfileController = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("-password")
    res.json(doctor)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password -phone -email")
    res.json(doctors)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}