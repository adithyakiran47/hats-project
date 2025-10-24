const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { runBotMimicUpdateAll } = require('../controllers/botMimicController');

router.use(authenticateJWT);

// Bot Mimic trigger endpoint - only Bot Mimic role allowed
router.post('/trigger', async (req, res) => {
  try {
    if (req.user.role !== 'botmimic') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedApps = await runBotMimicUpdateAll();
    res.json({ message: 'Bot Mimic update complete', updatedCount: updatedApps.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
