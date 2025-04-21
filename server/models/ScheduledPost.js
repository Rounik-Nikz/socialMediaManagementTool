const mongoose = require('mongoose');

const scheduledPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  platforms: [{
    type: String,
    enum: ['facebook', 'twitter', 'instagram', 'linkedin'],
    required: true
  }],
  scheduledDate: {
    type: Date,
    required: true
  },
  mediaUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date
  },
  error: {
    type: String
  }
});

module.exports = mongoose.model('ScheduledPost', scheduledPostSchema); 