const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  changedBy: { type: String, required: true },      // Name or role (admin/bot)
  oldStatus: { type: String, required: true },
  newStatus: { type: String, required: true },
  comment: { type: String },
  botMimic: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
