import express from "express";
import { getWeeklyReport } from "../Controllers/WeeklyReportController.js";

const router = express.Router();

router.get("/", getWeeklyReport);

export default router;
