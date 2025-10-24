const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

// Admin only: Create job
router.post('/create', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can post jobs' });
  }
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List active jobs (all users)
router.get('/list', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin only: Deactivate or update job
router.put('/update/:id', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can update jobs' });
  }
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
