import express from "express";
import { addAadharEntry, getAadharEntries,deleteAadharEntry } from "../Controllers/AadharenrolmentController.js";

const router = express.Router();
router.post("/", addAadharEntry);
router.get("/", getAadharEntries);
router.delete("/:id", deleteAadharEntry);

export default router;
