const express = require("express");
const router = express.Router();
const db = require("../db");

// 📊 Get all attack logs
router.get("/logs", (req, res) => {
  db.all(
    "SELECT * FROM attack_logs ORDER BY timestamp DESC",
    [],
    (err, rows) => {
      if (err) return res.send(err.message);
      res.json(rows);
    }
  );
});

// 🚨 Detect attacks
router.get("/detect-attacks", (req, res) => {
  db.all(
    `
    SELECT ip, COUNT(*) as attempts
    FROM attack_logs
    WHERE status = 'failed'
    GROUP BY ip
    HAVING attempts > 5
    `,
    [],
    (err, rows) => {
      if (err) return res.send(err.message);
      res.json(rows);
    }
  );
});



module.exports = router;