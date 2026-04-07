import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AttackLog from "../models/AttackLog.js";

// 🚨 Detect suspicious IP (OUTSIDE login - correct structure)
const checkSuspiciousIP = (ip) => {
  const last5Min = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const attempts = AttackLog.find({
    ip,
    status: "failed",
    timestamp: { $gte: last5Min }
  });

  return attempts && attempts.length >= 3; // threshold
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    let { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    email = email.trim().toLowerCase();

    const existingUser = User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      loginAttempts: 0,
      lockUntil: null
    };

    User.create(userData);

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);

    res.status(500).json({
      error: "Registration failed",
      details: err.message
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const ip = req.ip;

    // 🚨 Check suspicious IP early
    const isSuspicious = checkSuspiciousIP(ip);
    if (isSuspicious) {
      console.log("🚨 Suspicious IP detected:", ip);
    }

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    email = email.trim().toLowerCase();

    const user = User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔓 Auto unlock
    if (user.lockUntil && user.lockUntil < Date.now()) {
      User.updateOne(
        { email },
        { loginAttempts: 0, lockUntil: null }
      );
      user.loginAttempts = 0;
      user.lockUntil = null;
    }

    // ⛔ Check if locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      AttackLog.create({
        email,
        ip,
        status: "blocked"
      });

      return res.status(423).json({
        message: "Account locked due to too many failed attempts"
      });
    }

    // 🔐 Compare password
    const match = await bcrypt.compare(password, user.password);

    // ❌ Wrong password
    if (!match) {
      const newAttempts = user.loginAttempts + 1;
      const lockUntil = newAttempts >= 5 ? Date.now() + 10 * 60 * 1000 : null; // 10 mins

      AttackLog.create({
        email,
        ip,
        status: "failed"
      });

      User.updateOne(
        { email },
        { loginAttempts: newAttempts, lockUntil }
      );

      return res.status(400).json({
        message: "Invalid password",
        attemptsLeft: 5 - newAttempts > 0 ? 5 - newAttempts : 0
      });
    }

    // ✅ Success login
    User.updateOne(
      { email },
      { loginAttempts: 0, lockUntil: null }
    );

    AttackLog.create({
      email,
      ip,
      status: "success"
    });

    // 🔑 Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      error: "Login failed",
      details: err.message
    });
  }
};