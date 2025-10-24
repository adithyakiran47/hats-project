const mongoose = require('mongoose');
const Application = require('./models/Application'); // Adjust path if placed differently

const stageOrder = ['Applied', 'Reviewed', 'Interview', 'Offer'];

async function botMimicAutoProgress() {
  try {
    await mongoose.connect('your_mongodb_connection_string', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Find all technical role applications that are in progress
    const apps = await Application.find({
      jobType: 'technical',
      status: { $in: stageOrder.slice(0, -1) }, // stages before final
    });

    for (const app of apps) {
      const currentIndex = stageOrder.indexOf(app.status);
      if (currentIndex === -1 || currentIndex >= stageOrder.length - 1) continue;

      const newStatus = stageOrder[currentIndex + 1];

      // Append updated status
      app.status = newStatus;
      app.statusTimeline.push({
        status: newStatus,
        updatedAt: new Date(),
      });

      // Add Bot Mimic comment
      app.comments.push({
        by: 'botmimic',
        text: `Automatically progressed to ${newStatus}`,
        timestamp: new Date(),
      });

      await app.save();
    }

    console.log('Bot Mimic auto-progression completed.');
  } catch (error) {
    console.error('Error during Bot Mimic auto-progression:', error);
  } finally {
    mongoose.disconnect();
  }
}

// If calling directly, uncomment below
// botMimicAutoProgress();

module.exports = { botMimicAutoProgress };
