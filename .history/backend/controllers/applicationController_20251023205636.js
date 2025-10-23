// controllers/applicationController.js
const Application = require('../models/Application');

// Create new application
exports.createApplication = async (req, res) => {
  try {
    const { applicant, jobRole, comments } = req.body;

    const application = new Application({
      applicant,
      jobRole,
      comments
    });

    await application.save();
    res.status(201).json({ message: 'Application created', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
