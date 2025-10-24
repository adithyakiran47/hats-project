const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// List applications (with role-based population)
router.get('/list', async (req, res) => {
  try {
    const { applicant } = req.query; // optional filter by applicant id
    let query = {};
    if (applicant) query.applicant = applicant;
    const role = req.user.role;

    let findQuery = Application.find(query);

    // Populate applicant name and email if user is admin or botmimic
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
    const { jobRole, comments, jobType } = req.body;
    const applicant = req.user.id;

    let processedComments = [];
    if (Array.isArray(comments)) {
      processedComments = comments.flat(Infinity).map(String);
    } else if (comments) {
      processedComments = [String(comments)];
    }

    const newApp = new Application({
      applicant,
      jobRole,
      jobType, // store jobType as well
      comments: processedComments,
    });
    await newApp.save();
    res.status(201).json({ application: newApp });
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get application by ID with applicant info
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    console.error('Error fetching application:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Update application status
router.patch('/:id/status', async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status, comment } = req.body;
    const userId = req.user.id;

    // Fetch the application
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // Update status and optionally add a comment or activity log
    app.status = status;
    if (comment) {
      app.comments.push(comment);
    }

    // Save changes
    await app.save();

    res.json({ message: 'Status updated', application: app });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
