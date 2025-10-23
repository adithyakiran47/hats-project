const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// List applications, role-based population
router.get('/list', async (req, res) => {
  try {
    const { applicant } = req.query;
    let query = {};
    if (applicant) query.applicant = applicant;
    const role = req.user.role;

    let findQuery = Application.find(query);
    if (role === 'admin' || role === 'botmimic') {
      findQuery = findQuery.populate('applicant', 'name email');
    }

    const applications = await findQuery.exec();
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new application
router.post('/create', async (req, res) => {
  console.log('Create Application request body:', req.body);
  console.log('Current user:', req.user);
  try {
    const { jobRole, comments } = req.body;
    const applicant = req.user.id;

    // Ensure comments is a flat array of string
    let processedComments = [];
    if (Array.isArray(comments)) {
      // Flatten any nested arrays into a single level array
      processedComments = comments.flat(Infinity).map(String);
    } else if (comments) {
      processedComments = [String(comments)];
    }

    const newApp = new Application({
      applicant,
      jobRole,
      comments: processedComments
    });
    await newApp.save();
    res.status(201).json({ application: newApp });
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
