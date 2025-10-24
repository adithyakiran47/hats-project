const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobRole: { type: String, required: true },
  jobType: { 
    type: String, 
    enum: ['Technical', 'Non-Technical'],
    default: 'Non-Technical'
  },
  status: { 
    type: String, 
    enum: ['Applied', 'Reviewed', 'Interview', 'Offer'], 
    default: 'Applied' 
  },
  comments: [{ type: String }],
  lastUpdatedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
