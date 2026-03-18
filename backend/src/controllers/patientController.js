import Patient from "../models/Patient.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerPatientController = async (req, res) => {
  try {
    const { name, email, password, phone, age, historyOfSurgery, historyOfIllness } = req.body

    if (!name || !email || !password || !phone || !age) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const existingEmail = await Patient.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const existingPhone = await Patient.findOne({ phone })
    if (existingPhone) {
      return res.status(400).json({ message: "Phone already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // split illnesses by comma if provided
    const illnessArray = historyOfIllness
      ? historyOfIllness.split(",").map(item => item.trim())
      : []

    const patient = new Patient({
      name,
      email,
      password: hashedPassword,
      phone,
      age,
      historyOfSurgery: historyOfSurgery || "",
      historyOfIllness: illnessArray,
      profilePicture: req.file ? req.file.filename : ""
    })

    await patient.save()

    res.status(201).json({ message: "Patient registered successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const loginPatientController = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const patient = await Patient.findOne({ email })
    if (!patient) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, patient.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        age: patient.age,
        profilePicture: patient.profilePicture
      }
    })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getPatientProfileController = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select("-password")
    res.json(patient)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}