const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

// --- Get all jobs (all roles can view) ---
router.get('/list', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Get single job by ID ---
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Create new job (Admin only) ---
router.post('/create', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create jobs' });
    }

    const { title, jobType, description, requirements, location } = req.body;

    const newJob = new Job({
      title,
      jobType,
      description,
      requirements,
      location,
      createdBy: {
        userId: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    });

    await newJob.save();
    res.status(201).json({ job: newJob });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Update job (Admin only) ---
router.put('/update/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update jobs' });
    }

    const { title, jobType, description, requirements, location, status } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (title) job.title = title;
    if (jobType) job.jobType = jobType;
    if (description) job.description = description;
    if (requirements) job.requirements = requirements;
    if (location) job.location = location;
    if (status) job.status = status;
    job.updatedAt = new Date();

    await job.save();
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Delete job (Admin only) ---
router.delete('/delete/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete jobs' });
    }

    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
