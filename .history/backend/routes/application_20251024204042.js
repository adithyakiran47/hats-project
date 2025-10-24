const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

// Create new application
router.post('/create', async (req, res) => {
  try {
    const { jobId, jobRole, jobType, comments } = req.body;
    const applicant = {
      name: req.user.name,
      email: req.user.email,
      userId: req.user.id
    };
    const processedComments = [];
    if (comments) {
      comments.forEach(c => {
        processedComments.push({
          by: req.user.role,
          text: c,
          timestamp: new Date()
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
      activityLogs: [{
        role: req.user.role,
        comment: 'Application created',
        timestamp: new Date()
      }]
    });
    await newApplication.save();
    res.status(201).json({ application: newApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status + comment + activity log
router.put('/update-status/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'botmimic') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    const { status: newStatus, comment } = req.body;
    if (newStatus && newStatus !== application.status) {
      application.status = newStatus;
      application.statusTimeline.push({ status: newStatus, updatedAt: new Date() });
      if (comment && comment.trim() !== '') {
        application.comments.push({
          by: req.user.role,
          text: comment,
          timestamp: new Date()
        });
      }
      application.activityLogs.push({
        role: req.user.role,
        comment: comment ? comment : `Status changed to ${newStatus}`,
        timestamp: new Date()
      });
      await application.save();
    }
    res.json({ application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List applications (all for admin/botmimic, own for applicant)
router.get('/list', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'botmimic') {
      const userApplications = await Application.find({ 'applicant.userId': req.user.id });
      return res.json({ applications: userApplications });
    }
    const applications = await Application.find();
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get application by ID
router.get('/:id', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json({ application: app });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
