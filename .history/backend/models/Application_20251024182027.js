const mongoose = require('mongoose');

const statusTimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const applicationSchema = new mongoose.Schema({
  applicant: {
    name: String,
    email: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobRole: String,
  jobType: String,
  comments: [{
    by: String,
    text: String,
    timestamp: Date,
  }],
  statusTimeline: [statusTimelineSchema],
  status: { type: String, default: 'Applied' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', applicationSchema);
