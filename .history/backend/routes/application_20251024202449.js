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
    res.status
