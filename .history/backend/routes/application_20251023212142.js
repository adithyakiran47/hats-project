const express = require('express');
const router = express.Router();
const { createApplication, updateApplicationStatus, listApplications, getActivityLogs } = require('../controllers/applicationController');

router.post('/create', createApplication);
router.post('/:applicationId/update-status', updateApplicationStatus);
router.get('/list', listApplications);
router.get('/:applicationId/logs', getActivityLogs);

module.exports = router;
