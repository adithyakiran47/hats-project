const express = require('express');
const router = express.Router();
const { progressTechnicalApplications } = require('../services/botMimicService');
const authenticateJWT = require('../middleware/authenticateJWT');

// only bot or admin ar allowed
router.post('/run', authenticateJWT, async (req, res) => {
  if (!['admin', 'botmimic'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    await progressTechnicalApplications();
    res.json({ message: 'Bot Mimic run completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
