const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  jobType: { 
    type: String, 
    required: true,
    enum: ['technical', 'non-technical']
  },
  description: { type: String },
  requirements: { type: String },
  location: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'closed'],
    default: 'active'
  },
  createdBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
