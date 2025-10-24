const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

// Create new application with jobId & initial status timeline
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
    });

    await newApplication.save();
    res.status(201).json({ application: newApplication });
  } catch (error) {
    console.error('Create Application Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update application status - append to status timeline with extensive logging
router.put('/update-status/:id', async (req, res) => {
  try {
    console.log('Request user:', req.user);
    console.log('Update status for app ID:', req.params.id);
    console.log('Payload:', req.body);

    if (req.user.role !== 'admin' && req.user.role !== 'botmimic') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      console.error('Application not found:', req.params.id);
      return res.status(404).json({ error: 'Application not found' });
    }

    const newStatus = req.body.status;
    if (newStatus && newStatus !== application.status) {
      application.status = newStatus;
      application.statusTimeline.push({ status: newStatus, updatedAt: new Date() });
      await application.save();
      console.log('Status updated to:', newStatus);
    } else {
      console.log('No new status or status unchanged.');
    }

    res.json({ application });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get list of applications (all for admins, own applications for users)
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

// Admin metrics summary endpoint
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
