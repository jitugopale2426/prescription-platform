import express from "express"
import doctorRouter from "./doctorRoutes.js";
import patientRouter from "./patientRoutes.js";
import consultationRouter from "./consultationRoutes.js";
import prescriptionRouter from "./prescriptionRoutes.js";

const rootRouter = express.Router()

rootRouter.use('/doctor',doctorRouter);
rootRouter.use("/patient", patientRouter);
rootRouter.use("/consultation", consultationRouter);
rootRouter.use("/prescription", prescriptionRouter);

export default rootRouter;