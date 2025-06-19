import express from "express";
import { addPhoneEntry, getPhoneEntries } from "../Controllers/PhoneController.js";

const router = express.Router();
router.post("/", addPhoneEntry);
router.get("/", getPhoneEntries);

export default router;
