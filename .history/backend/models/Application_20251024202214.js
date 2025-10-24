const mongoose = require('mongoose');

const statusTimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  by: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
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
  comments: [commentSchema],
  statusTimeline: [statusTimelineSchema],
  status: { type: String, default: 'Applied' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', applicationSchema);
