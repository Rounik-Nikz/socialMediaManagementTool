const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook']
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  mediaFileName: {
    type: String,
    default: null
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  // Dummy metrics
  metrics: {
    likes: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['scheduled', 'posted'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema); 