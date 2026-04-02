import express from "express";
import { getHumidity, getTemperature } from "../controllers/sensorController.ts";

const router = express.Router();

router.get("/humidity", getHumidity);
router.get("/temperature", getTemperature);

export default router;