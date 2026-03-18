const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ ADD THIS

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route ✅ ADD THIS
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to protected route 🎉",
    user: req.user
  });
});

module.exports = router;