const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: {
    name: String,
    email: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobRole: String,
  jobType: String,
  comments: [
    {
      by: String,
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  activityLogs: [
    {
      role: String,
      comment: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  statusTimeline: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  status: {
    type: String,
    enum: ['Applied', 'Reviewed', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
