const Application = require('../models/Application');
const ActivityLog = require('../models/ActivityLog');

// Define status flow
const statusFlow = ['Applied', 'Reviewed', 'Interview', 'Offer'];

async function progressTechnicalApplications() {
  const techApplications = await Application.find({ jobRole: /technical/i });

  for (let app of techApplications) {
    // Find current status index
    let currentIndex = statusFlow.indexOf(app.status);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) continue; // skip if invalid or at final status

    // Move to next status
    const newStatus = statusFlow[currentIndex + 1];

    // Update application
    app.status = newStatus;
    app.lastUpdatedBy = 'Bot Mimic';
    await app.save();

    // Create activity log
    await ActivityLog.create({
      application: app._id,
      status: newStatus,
      comment: 'Automated status update by Bot Mimic',
      changedBy: 'Bot Mimic',
    });
  }
}

module.exports = { progressTechnicalApplications };
