const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  roleType: { type: String, enum: ['technical', 'non-technical'], required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Job', jobSchema);
