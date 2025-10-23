// routes/application.js
const express = require('express');
const router = express.Router();
const { createApplication } = require('../controllers/applicationController');

// Create new application
router.post('/create', createApplication);

module.exports = router;
