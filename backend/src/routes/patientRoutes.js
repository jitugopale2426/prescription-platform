import express from "express"
import {
  registerPatientController,
  loginPatientController,
  getPatientProfileController
} from "../controllers/patientController.js"
import authMiddleware from "../middleware/auth.js"
import upload from "../middleware/upload.js"

const patientRouter = express.Router()

patientRouter.post("/register", upload.single("profilePicture"), registerPatientController);
patientRouter.post("/login", loginPatientController);
patientRouter.get("/profile", authMiddleware, getPatientProfileController);

export default patientRouter