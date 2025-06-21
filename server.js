import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js"; // MongoDB connection
import aadharRoutes from "./Routes/AadharRoute.js";
import childRoutes from "./Routes/ChildRoute.js";
import phoneRoutes from "./Routes/PhoneRoute.js";
import todayReportRoutes from "./Routes/TodayReportRoute.js"
import weeklyReportRoutes from "./Routes/WeeklyRoute.js"
dotenv.config();
const app = express();
connectDB(); // Connect MongoDB

app.use(express.json());
app.use(cors());

// Load credentials from .env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, message: "Login successful!" });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Middleware to verify JWT for protected routes
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};


// Routes
app.use("/aadhar", authenticate, aadharRoutes);
app.use("/child", authenticate, childRoutes);
app.use("/phone", authenticate, phoneRoutes);
app.use("/today", authenticate, todayReportRoutes);
app.use("/weekly-report", authenticate, weeklyReportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
