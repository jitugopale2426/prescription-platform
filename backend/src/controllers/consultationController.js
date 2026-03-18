import Consultation from "../models/Consultation.js"

export const createConsultationController = async (req, res) => {
  try {
    const {
      doctorId,
      currentIllness,
      recentSurgery,
      isDiabetic,
      allergies,
      others,
      transactionId
    } = req.body

    if (!doctorId || !currentIllness || !transactionId) {
      return res.status(400).json({ message: "Required fields missing" })
    }

    const consultation = new Consultation({
      patientId: req.user.id,
      doctorId,
      currentIllness,
      recentSurgery: recentSurgery || "",
      isDiabetic: isDiabetic || false,
      allergies: allergies || "",
      others: others || "",
      transactionId
    })

    await consultation.save()

    res.status(201).json({ message: "Consultation submitted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getPatientConsultationsController = async (req, res) => {
  try {
    const consultations = await Consultation.find({ patientId: req.user.id })
      .populate("doctorId", "name specialty")
      .sort({ createdAt: -1 })
    res.json(consultations)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getDoctorConsultationsController = async (req, res) => {
  try {
    const consultations = await Consultation.find({ doctorId: req.user.id })
      .populate("patientId", "name age historyOfIllness historyOfSurgery")
      .populate("doctorId", "name specialty")
      .sort({ createdAt: -1 })
    res.json(consultations)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getSingleConsultationController = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate("patientId", "name age historyOfIllness historyOfSurgery")
      .populate("doctorId", "name specialty")
    
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" })
    }

    res.json(consultation)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}