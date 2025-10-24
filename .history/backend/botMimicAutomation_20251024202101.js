const Application = require('./models/Application');

const stageOrder = ['Applied', 'Reviewed', 'Interview', 'Offer'];

async function botMimicAutoProgress() {
  try {
    // Find all technical role applications that can move forward
    const apps = await Application.find({
      jobType: 'technical',
      status: { $in: stageOrder.slice(0, stageOrder.length - 1) } // All but last stage
    });

    for (const app of apps) {
      const currentIndex = stageOrder.indexOf(app.status);
      if (currentIndex === -1 || currentIndex === stageOrder.length - 1) continue;

      const newStatus = stageOrder[currentIndex + 1];
      app.status = newStatus;
      app.statusTimeline.push({
        status: newStatus,
        updatedAt: new Date()
      });

      // Add Bot Mimic comment
      app.comments.push({
        by: 'botmimic',
        text: `Automatically progressed to ${newStatus}`,
        timestamp: new Date()
      });

      await app.save();
    }
  } catch (error) {
    console.error('Bot Mimic Automation Error:', error);
  }
}

module.exports = { botMimicAutoProgress };
