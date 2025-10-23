const Application = require('../models/Application');
const ActivityLog = require('../models/ActivityLog');

// Create new application
exports.createApplication = async (req, res) => {
  try {
    const { applicant, jobRole, comments } = req.body;
    const application = new Application({ applicant, jobRole, comments });
    await application.save();
    res.status(201).json({ message: 'Application created', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update application status (Admin or Bot Mimic)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { newStatus, comment, changedBy, botMimic } = req.body;
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    const oldStatus = application.status;
    application.status = newStatus;
    if (comment) {
      application.comments.push(comment);
    }
    application.lastUpdatedBy = changedBy;
    await application.save();

    const logEntry = new ActivityLog({
      application: application._id,
      changedBy,
      oldStatus,
      newStatus,
      comment,
      botMimic: botMimic || false
    });
    await logEntry.save();

    res.json({ message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// List Applications with optional applicant filter
exports.listApplications = async (req, res) => {
  try {
    const filter = {};
    if (req.query.applicant) {
      filter.applicant = req.query.applicant;
    }
    const applications = await Application.find(filter).populate('applicant', 'name email').sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get Activity Logs for given application
exports.getActivityLogs = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const logs = await ActivityLog.find({ application: applicationId }).sort({ createdAt: -1 });
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
