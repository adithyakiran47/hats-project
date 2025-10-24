const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authenticateJWT = require('../middleware/authenticateJWT');// middleware to verify JWT

router.use(authenticateJWT);

// Create new application
router.post('/create', async (req, res) => {
  try {
    const { jobRole, jobType, comments } = req.body;
    const applicant = req.user.id;

    const processedComments = Array.isArray(comments) ? comments.flat(Infinity).map(String) : comments ? [String(comments)] : [];

    const newApp = new Application({
      applicant,
      jobRole,
      jobType,
      comments: processedComments,
    });
    await newApp.save();
    res.status(201).json({ application: newApp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
