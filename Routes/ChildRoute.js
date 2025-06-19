import express from "express";
import { addChildEntry, getChildEntries } from "../Controllers/ChildController.js";

const router = express.Router();
router.post("/", addChildEntry);
router.get("/", getChildEntries);

export default router;
