const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use(authenticateJWT);

// Admin: Create a new job
router.post('/create', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create jobs' });
    }

    const { title, roleType, description } = req.body;
    if (!title || !roleType || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newJob = new Job({ title, roleType, description });
    await newJob.save();

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all active jobs
router.get('/list', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update an existing job
router.put('/update/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update jobs' });
    }

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    res.json({ message: 'Job updated successfully', job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete a job
router.delete('/delete/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete jobs' });
    }

    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
