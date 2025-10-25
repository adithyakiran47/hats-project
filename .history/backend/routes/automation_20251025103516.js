const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

// Run automation for technical applications
router.post('/run', async (req, res) => {
  try {
    // Only Bot Mimic or Admin can run automation
    if (req.user.role !== 'botmimic' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized. Only Bot Mimic or Admin can run automation.' });
    }

    // Find all technical applications with status 'Applied'
    const applicationsToUpdate = await Application.find({
      jobType: 'technical',
      status: 'Applied'
    });

    if (applicationsToUpdate.length === 0) {
      return res.json({ 
        message: 'No technical applications with "Applied" status found.',
        updatedCount: 0 
      });
    }

    const updatedApplications = [];

    // Update each application
    for (const app of applicationsToUpdate) {
      // Progress: Applied → Reviewed
      app.status = 'Reviewed';
      
      // Add status timeline entry
      app.statusTimeline.push({
        status: 'Reviewed',
        updatedAt: new Date()
      });

      // Add bot comment to comments array
      app.comments.push({
        by: 'Bot Mimic',
        text: 'Application automatically reviewed by Bot Mimic system.',
        timestamp: new Date()
      });

      // Add activity log
      app.activityLogs.push({
        role: 'botmimic',
        comment: 'Status automatically updated from Applied to Reviewed',
        timestamp: new Date()
      });

      await app.save();
      updatedApplications.push(app);
    }

    res.json({
      message: `Successfully automated ${updatedApplications.length} technical application(s).`,
      updatedCount: updatedApplications.length,
      applications: updatedApplications.map(app => ({
        id: app._id,
        jobRole: app.jobRole,
        previousStatus: 'Applied',
        newStatus: 'Reviewed'
      }))
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get automation history/logs
router.get('/logs', async (req, res) => {
  try {
    // Only Bot Mimic or Admin can view logs
    if (req.user.role !== 'botmimic' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Find technical applications with bot activity
    const applications = await Application.find({
      jobType: 'technical',
      'activityLogs.role': 'botmimic'
    }).select('jobRole status activityLogs createdAt').sort({ createdAt: -1 }).limit(50);

    const logs = [];
    applications.forEach(app => {
      const botLogs = app.activityLogs.filter(log => log.role === 'botmimic');
      botLogs.forEach(log => {
        logs.push({
          applicationId: app._id,
          jobRole: app.jobRole,
          currentStatus: app.status,
          action: log.comment,
          timestamp: log.timestamp
        });
      });
    });

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
