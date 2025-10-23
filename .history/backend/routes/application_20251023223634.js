const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Make sure that your authentication middleware sets req.user with the user's role and id
// Example: req.user = { id: user._id, role: user.role }

router.get('/list', async (req, res) => {
  try {
    const { applicant } = req.query;
    let query = {};
    if (applicant) query.applicant = applicant;

    // Role and authentication check (make sure this matches your authentication logic)
    const role = req.user.role;

    let findQuery = Application.find(query);

    // Show applicant details only for admin and botmimic
    if (role === 'admin' || role === 'botmimic') {
      findQuery = findQuery.populate('applicant', 'name email');
    }

    const applications = await findQuery.exec();
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
