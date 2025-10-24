const express = require('express');
const router = express.Router();
const { runBotMimic } = require('../controllers/botMimicController');
const authenticateJWT = require('../middlewares/authMiddleware');

router.post('/run', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only Admins can trigger Bot Mimic' });
  }
  try {
    await runBotMimic();
    res.json({ message: 'Bot Mimic run successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Bot Mimic failed', error });
  }
});

module.exports = router;
