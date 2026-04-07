import express from "express";
import dotenv from "dotenv";
import { register, login } from "./controllers/authController.js";
import connectDB from "./db.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ connect to DB
connectDB();

// Routes
app.post("/api/register", register);
app.post("/api/login", login);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});