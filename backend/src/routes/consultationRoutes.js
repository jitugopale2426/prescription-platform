import express from "express"
import {
  createConsultationController,
  getPatientConsultationsController,
  getDoctorConsultationsController,
  getSingleConsultationController
} from "../controllers/consultationController.js"
import authMiddleware from "../middleware/auth.js"

const consultationRouter = express.Router()

consultationRouter.post("/create", authMiddleware, createConsultationController);
consultationRouter.get("/patient", authMiddleware, getPatientConsultationsController);
consultationRouter.get("/doctor", authMiddleware, getDoctorConsultationsController);
consultationRouter.get("/:id", authMiddleware, getSingleConsultationController);

export default consultationRouter