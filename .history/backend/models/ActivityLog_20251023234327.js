const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  status: { type: String, enum: ['Applied', 'Reviewed', 'Interview', 'Offer'], required: true },
  comment: { type: String },
  changedBy: { type: String, default: 'Bot Mimic' }, // or admin/applicant user
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
