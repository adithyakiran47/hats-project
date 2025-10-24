const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

// Create new application with jobId & initial status timeline
router.post('/create', async (req, res) => {
  try {
    const { jobId, jobRole, jobType, comments } = req.body;

    // Add validation as needed for jobId existence

    const applicant = {
      name: req.user.name,
      email: req.user.email,
      userId: req.user.id,
    };

    const processedComments = [];
    if (comments) {
      comments.forEach(c => {
        processedComments.push({
          by: req.user.role,
          text: c,
          timestamp: new Date(),
        });
      });
    }

    const newApplication = new Application({
      applicant,
      jobId,
      jobRole,
      jobType,
      comments: processedComments,
      statusTimeline: [{ status: 'Applied', updatedAt: new Date() }],
      status: 'Applied',
    });

    await newApplication.save();
    res.status(201).json({ application: newApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status - append to status timeline
router.put('/update-status/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'botmimic') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    const newStatus = req.body.status;
    if (newStatus && newStatus !== application.status) {
      application.status = newStatus;
      application.statusTimeline.push({ status: newStatus, updatedAt: new Date() });
      await application.save();
    }

    res.json({ application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all applications (including user based filtering)
router.get('/list', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'botmimic') {
      // For non-admin users, return only their own applications
      const userApplications = await Application.find({ 'applicant.userId': req.user.id });
      return res.json({ applications: userApplications });
    }
    // Admin and botmimic see all applications
    const applications = await Application.find();
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
