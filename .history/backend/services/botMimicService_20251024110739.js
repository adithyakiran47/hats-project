const Application = require('../models/Application');

// Workflow stages for technical roles
const WORKFLOW_STAGES = [
  'Applied',
  'Reviewed',
  'Interview Scheduled',
  'Interview Completed',
  'Offer Extended',
  'Selected',
  'Rejected'
];

// Simulate a Bot Mimic automated update for technical role applications
async function runBotMimicUpdates() {
  try {
    // Find technical role applications not yet in final state
    const apps = await Application.find({
      jobType: 'Technical',
      status: { $nin: ['Selected', 'Rejected'] } // exclude finalized statuses
    });

    for (const app of apps) {
      // Determine next status in workflow
      const currentIndex = WORKFLOW_STAGES.indexOf(app.status);
      if (currentIndex === -1 || currentIndex === WORKFLOW_STAGES.length - 1) {
        continue; // no further status or unknown, skip
      }
      const nextStatus = WORKFLOW_STAGES[currentIndex + 1];

      // Prepare a bot mimic comment for this update
      const comment = `Status automatically updated to "${nextStatus}" by Bot Mimic`;

      // Update application status and add comment
      app.status = nextStatus;
      app.comments.push(comment);
      app.lastUpdatedBy = 'Bot Mimic';

      await app.save();
      console.log(`Bot Mimic updated Application ID ${app._id} to status: ${nextStatus}`);
    }
  } catch (err) {
    console.error('Bot Mimic error:', err);
  }
}

module.exports = { runBotMimicUpdates };
