const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook'],
    required: true
  },
  scheduledDate: {
    type: Date
  },
  mediaFileName: {
    type: String
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'failed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date
  },
  // Dummy metrics
  metrics: {
    likes: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema); 