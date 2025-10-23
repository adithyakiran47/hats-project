const express = require('express');
const router = express.Router();
const { createApplication, updateApplicationStatus } = require('../controllers/applicationController');

router.post('/create', createApplication);
router.post('/:applicationId/update-status', updateApplicationStatus);

module.exports = router;
