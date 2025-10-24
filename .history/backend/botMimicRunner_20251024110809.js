const { runBotMimicUpdates } = require('./services/botMimicService');

// Example of running Bot Mimic process on demand
async function run() {
  console.log('Running Bot Mimic updates...');
  await runBotMimicUpdates();
  console.log('Bot Mimic updates completed.');
}

// Run once if invoked directly
if (require.main === module) {
  run().catch(console.error);
}

module.exports = run;
