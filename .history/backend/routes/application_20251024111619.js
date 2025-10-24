const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

router.post('/create', async (req, res) => {
  const { role } = req.user;

  if (role === 'admin' || role === 'botmimic') {
    return res.status(403).json({ error: 'You do not have permission to apply' });
  }

  try {
    const { jobRole, jobType, comments } = req.body;
    const applicant = req.user.id;

    const processedComments = Array.isArray(comments)
      ? comments.flat(Infinity).map(String)
      : comments
      ? [String(comments)]
      : [];

    const newApp = new Application({ applicant, jobRole, jobType, comments: processedComments });

    await newApp.save();

    res.status(201).json({ application: newApp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/list', async (req, res) => {
  const { role, id } = req.user;
  try {
    let filter = {};
    if (role === 'applicant') {
      filter.applicant = id;
    }

    const applications = await Application.find(filter)
      .populate('applicant', 'name email role')
      .exec();

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update application status with traceable comments 
router.put('/update-status/:id', async (req, res) => {
  const { role, name } = req.user;
  if (role !== 'admin' && role !== 'botmimic') {
    return res.status(403).json({ error: 'Only admin or botmimic can update status' });
  }

  const appId = req.params.id;
  const { status } = req.body;

  try {
    const application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status || application.status;

    const comment = `Status manually updated to "${application.status}" by ${name || role}`;
    application.comments = application.comments || [];
    application.comments.push(comment);

    application.lastUpdatedBy = name || role;

    await application.save();

    res.json({ application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
