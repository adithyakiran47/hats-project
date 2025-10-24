const Application = require('../models/Application');

// Define standard workflow stages for technical roles
const WORKFLOW_STAGES = ["Applied", "Reviewed", "Interview", "Offer", "Selected", "Rejected"];

// Function to simulate update on one application
async function processBotMimicUpdate(application) {
  const currentStatus = application.status || "Applied";
  const currentIndex = WORKFLOW_STAGES.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= WORKFLOW_STAGES.length - 1) {
    // Already at final stage or unknown status, no update
    return null;
  }

  const nextStatus = WORKFLOW_STAGES[currentIndex + 1];
  application.status = nextStatus;
  application.statusTimeline.push({
    status: nextStatus,
    updatedAt: new Date(),
    updatedBy: "botmimic",
  });
  application.comments.push({
    by: "botmimic",
    text: `Status auto-updated to ${nextStatus}`,
    timestamp: new Date(),
  });
  await application.save();
  return application;
}

// Function to update all technical applications by Bot Mimic
async function runBotMimicUpdateAll() {
  const technicalApps = await Application.find({ jobType: /technical/i, status: { $ne: "Rejected" } });
  const updates = [];
  for (const app of technicalApps) {
    const updatedApp = await processBotMimicUpdate(app);
    if (updatedApp) {
      updates.push(updatedApp);
    }
  }
  return updates;
}

module.exports = {
  runBotMimicUpdateAll,
};
