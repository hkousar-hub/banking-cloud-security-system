import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AttackLog from "../models/AttackLog.js";
import BlockedIP from "../models/BlockedIP.js";
import { generateOTP, verifyOTP } from "../services/otpService.js";

const router = Router();

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Registration handled by controller
    res.json({ message: "User registered ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ LOGIN (WITH SECURITY)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip;

  try {
    // 🚫 check blocked IP
    const blocked = BlockedIP.findOne({ ip });

    if (blocked) {
      return res.status(403).json({ message: "IP blocked 🚫" });
    }

    // 🔍 get user
    const user = User.findOne({ email });

    // ❌ invalid credentials
    if (!user || user.password !== password) {
      AttackLog.create({ email, ip, status: "failed" });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🚨 NEW DEVICE → OTP
    if (user.last_ip && user.last_ip !== ip) {
      generateOTP(email);
      return res.json({
        message: "⚠️ New device detected. OTP sent",
        requireOTP: true
      });
    }

    // ✅ success log
    AttackLog.create({ email, ip, status: "success" });

    // ✅ update IP
    User.updateOne({ email }, { last_ip: ip });

    // 🔐 JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login success ✅", token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const ip = req.ip;

  const valid = verifyOTP(email, otp);

  if (!valid) {
    return res.status(401).json({ message: "Invalid OTP ❌" });
  }

  const user = User.findOne({ email });
  if (user) {
    User.updateOne({ email }, { last_ip: ip });
  }

  res.json({ message: "OTP verified ✅ Login successful" });
});

// 📊 GET LOGS
router.get("/logs", async (req, res) => {
  try {
    const logs = AttackLog.find({});
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚫 BLOCK IP
router.post("/block-ip", async (req, res) => {
  const { ip } = req.body;

  try {
    const blocked = new BlockedIP({ ip });
    // Blocked IP already saved in controller
    res.json({ message: "IP blocked 🚫" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚨 SUSPICIOUS IPS
router.get("/suspicious", async (req, res) => {
  try {
    const data = await AttackLog.aggregate([
      { $match: { status: 'failed' } },
      { $group: { _id: '$ip', attempts: { $sum: 1 } } },
      { $match: { attempts: { $gte: 3 } } },
      { $project: { ip: '$_id', attempts: 1, _id: 0 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🌍 GEO LOCATION
router.get("/geo-logs", async (req, res) => {
  try {
    const logs = await AttackLog.distinct('ip');

    const geoData = [];

    for (let ip of logs) {
      try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();

        geoData.push({
          ip,
          lat: data.lat,
          lon: data.lon,
          country: data.country
        });
      } catch (err) {
        console.log(err);
      }
    }

    res.json(geoData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;