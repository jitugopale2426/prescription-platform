import express from "express"
import {
  registerDoctorController,
  loginDoctorController,
  getDoctorProfileController,
  getAllDoctorsController
} from "../controllers/doctorController.js"
import authMiddleware from "../middleware/auth.js"
import upload from "../middleware/upload.js"

const doctorRouter = express.Router()

doctorRouter.post("/register", upload.single("profilePicture"), registerDoctorController);
doctorRouter.post("/login", loginDoctorController);
doctorRouter.get("/profile", authMiddleware, getDoctorProfileController);
doctorRouter.get("/all", getAllDoctorsController);

export default doctorRouter;