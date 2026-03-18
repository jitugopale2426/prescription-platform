import Prescription from "../models/Prescription.js"
import Consultation from "../models/Consultation.js"

export const createPrescriptionController = async (req, res) => {
  try {
    const { consultationId, patientId, careToBeTaken, medicines } = req.body

    if (!consultationId || !patientId || !careToBeTaken) {
      return res.status(400).json({ message: "Required fields missing" })
    }

    const existing = await Prescription.findOne({ consultationId })
    if (existing) {
      return res.status(400).json({ message: "Prescription already exists for this consultation" })
    }

    const prescription = new Prescription({
      consultationId,
      doctorId: req.user.id,
      patientId,
      careToBeTaken,
      medicines: medicines || ""
    })

    await prescription.save()

    // mark consultation as completed
    await Consultation.findByIdAndUpdate(consultationId, { status: "completed" })

    res.status(201).json({ message: "Prescription created", prescription })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const updatePrescriptionController = async (req, res) => {
  try {
    const { careToBeTaken, medicines } = req.body

    const prescription = await Prescription.findById(req.params.id)
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" })
    }

    prescription.careToBeTaken = careToBeTaken || prescription.careToBeTaken
    prescription.medicines = medicines || prescription.medicines

    await prescription.save()

    res.json({ message: "Prescription updated", prescription })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getPrescriptionByConsultationController = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      consultationId: req.params.consultationId
    })
      .populate("doctorId", "name specialty")
      .populate("patientId", "name age")

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" })
    }

    res.json(prescription)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const savePdfPathController = async (req, res) => {
  try {
    const { pdfPath } = req.body

    await Prescription.findByIdAndUpdate(req.params.id, { pdfPath })

    res.json({ message: "PDF path saved" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const sendToPatientController = async (req, res) => {
  try {
    await Prescription.findByIdAndUpdate(req.params.id, {
      isSentToPatient: true
    })

    res.json({ message: "Prescription sent to patient" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getPatientPrescriptionsController = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.user.id,
      isSentToPatient: true
    })
      .populate("doctorId", "name specialty")
      .sort({ createdAt: -1 })

    res.json(prescriptions)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}