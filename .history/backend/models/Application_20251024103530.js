const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobRole: { type: String, required: true },
  jobType: { type: String, required: true },
  comments: [String],
  status: { type: String, default: 'Applied' },
  lastUpdatedBy: String,
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
