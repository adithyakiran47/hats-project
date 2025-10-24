const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

// Create new application with initial comment and activity log
router.post('/create', async (req, res) => {
  try {
    const { jobId, jobRole, jobType, comments } = req.body;

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
      activityLogs: [{                        // Initial activity log entry
        role: req.user.role,
        comment: 'Application created',
        timestamp: new Date(),
      }],
    });

    await newApplication.save();
    res.status(201).json({ application: newApplication });
  } catch (error) {
    console.error('Create Application Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update application status, add optional comment and traceability log
router.put('/update-status/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'botmimic') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { status: newStatus, comment } = req.body;

    if (newStatus && newStatus !== application.status) {
      application.status = newStatus;
      application.statusTimeline.push({ status: newStatus, updatedAt: new Date() });

      if (comment && comment.trim() !== '') {
        application.comments.push({
          by: req.user.role,
          text: comment,
          timestamp: new Date(),
        });
      }

      // Add to activityLogs for traceability
      application.activityLogs.push({
        role: req.user.role,
        comment: comment ? comment : `Status changed to ${newStatus}`,
        timestamp: new Date(),
      });

      await application.save();
    }

    res.json({ application });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List applications: All applications for admin/botmimic, own apps for applicant
router.get('/list', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'botmimic') {
      const userApplications = await Application.find({ 'applicant.userId': req.user.id });
      return res.json({ applications: userApplications });
    }
    const applications = await Application.find();
    res.json({ applications });
  } catch (error) {
    console.error('List Applications Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin metrics summary endpoint for dashboard stats
router.get('/metrics', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const totalApplications = await Application.countDocuments();
    const statusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const recentActivity = await Application.find().sort({ updatedAt: -1 }).limit(10);

    res.json({ totalApplications, statusCounts, recentActivity });
  } catch (error) {
    console.error('Metrics Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
