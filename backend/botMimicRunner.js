const { runBotMimicUpdates } = require('./services/botMimicService');

async function run() {
  console.log('Starting Bot Mimic automation...');
  await runBotMimicUpdates();
  console.log('Bot Mimic automation completed.');
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = run;
