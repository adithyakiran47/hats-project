const Application = require('../models/Application');

const BOT_MIMIC_ROLES = ['Technical']; // Only act on Technical job types

// Example function to process bot mimic updates
exports.runBotMimic = async () => {
  try {
    // Find applications that are Technical only and in specific statuses to progress
    const applications = await Application.find({
      jobType: { $in: BOT_MIMIC_ROLES },
      status: { $in: ['Applied', 'Reviewed', 'Interview'] }
    });

    for (const app of applications) {
      // Logic to advance application status: Applied -> Reviewed -> Interview -> Offer
      let newStatus = '';
      switch(app.status) {
        case 'Applied':
          newStatus = 'Reviewed';
          break;
        case 'Reviewed':
          newStatus = 'Interview';
          break;
        case 'Interview':
          newStatus = 'Offer';
          break;
      }

      if (newStatus) {
        app.status = newStatus;
        app.lastUpdatedBy = 'botmimic';
        app.comments.push(`Auto-updated to ${newStatus} by Bot Mimic`);
        await app.save();
      }
    }
    console.log(`Bot Mimic processed ${applications.length} applications.`);
  } catch (error) {
    console.error('Bot Mimic error:', error);
  }
};
