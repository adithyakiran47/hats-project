// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobRole: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Reviewed', 'Interview', 'Offer'], 
    default: 'Applied' 
  },
  comments: [{ type: String }],
  lastUpdatedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
