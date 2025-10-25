const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let query = {};
    
    // Applicants see only their applications
    if (role === 'applicant') {
      query['applicant.userId'] = userId;
    }
    
    // Bot Mimic sees only technical applications
    if (role === 'botmimic') {
      query.jobType = 'technical';
    }
    
    // Admin sees all applications (no filter)

    const applications = await Application.find(query);

    // Count by status
    const statusCounts = {
      Applied: 0,
      Reviewed: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    applications.forEach(app => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });

    // Count by job type
    const jobTypeCounts = {
      technical: 0,
      'non-technical': 0
    };

    applications.forEach(app => {
      if (app.jobType === 'technical') {
        jobTypeCounts.technical++;
      } else if (app.jobType === 'non-technical') {
        jobTypeCounts['non-technical']++;
      }
    });

    res.json({
      totalApplications: applications.length,
      statusCounts,
      jobTypeCounts,
      recentApplications: applications.slice(-5).reverse()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
