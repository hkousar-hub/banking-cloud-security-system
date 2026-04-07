const express = require("express");
const AWS = require("../aws");
const parseXML = require("../xmlParser");

const router = express.Router();

router.get("/aws-test", async (req, res) => {
  try {
    const xml = `
      <user>
        <name>Heena</name>
        <role>Admin</role>
      </user>
    `;

    const parsed = await parseXML(xml);

    res.json({
      message: "AWS + XML working",
      data: parsed
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;