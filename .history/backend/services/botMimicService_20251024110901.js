const Application = require('../models/Application');

const WORKFLOW_STAGES = [
  'Applied',
  'Reviewed',
  'Interview Scheduled',
  'Interview Completed',
  'Offer Extended',
  'Selected',
  'Rejected'
];

async function runBotMimicUpdates() {
  try {
    const apps = await Application.find({
      jobType: 'Technical',
      status: { $nin: ['Selected', 'Rejected'] }
    });

    for (const app of apps) {
      const currentIndex = WORKFLOW_STAGES.indexOf(app.status);
      if (currentIndex === -1 || currentIndex === WORKFLOW_STAGES.length - 1) {
        continue;
      }
      const nextStatus = WORKFLOW_STAGES[currentIndex + 1];

      const comment = `Status automatically updated to "${nextStatus}" by Bot Mimic`;

      app.status = nextStatus;
      app.comments.push(comment);
      app.lastUpdatedBy = 'Bot Mimic';

      await app.save();
      console.log(`Bot Mimic updated application ${app._id} with status "${nextStatus}"`);
    }
  } catch (err) {
    console.error('Bot Mimic Automation Error:', err);
  }
}

module.exports = { runBotMimicUpdates };
