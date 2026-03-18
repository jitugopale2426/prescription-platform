import express from "express"
import {
  createPrescriptionController,
  updatePrescriptionController,
  getPrescriptionByConsultationController,
  savePdfPathController,
  sendToPatientController,
  getPatientPrescriptionsController
} from "../controllers/prescriptionController.js"
import authMiddleware from "../middleware/auth.js"

const prescriptionRouter = express.Router()

prescriptionRouter.post("/create", authMiddleware, createPrescriptionController);
prescriptionRouter.put("/update/:id", authMiddleware, updatePrescriptionController);
prescriptionRouter.get("/consultation/:consultationId", authMiddleware, getPrescriptionByConsultationController);
prescriptionRouter.put("/save-pdf/:id", authMiddleware, savePdfPathController);
prescriptionRouter.put("/send/:id", authMiddleware, sendToPatientController);
prescriptionRouter.get("/patient", authMiddleware, getPatientPrescriptionsController);

export default prescriptionRouter