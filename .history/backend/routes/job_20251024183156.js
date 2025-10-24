const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

// Admin only: Create a new job
router.post('/create', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can post jobs' });
    }

    const { title, roleType, description } = req.body;
    const newJob = new Job({ title, roleType, description });
    await newJob.save();

    res.status(201).json({ job: newJob });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all active jobs (for applicants)
router.get('/list', async (req, res) => {
  try {
    const activeJobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ jobs: activeJobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update job (edit or deactivate)
router.put('/update/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete job
router.delete('/delete/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
