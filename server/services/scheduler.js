const schedule = require('node-schedule');
const ScheduledPost = require('../models/ScheduledPost');
const Post = require('../models/Post');

class PostScheduler {
  constructor() {
    this.jobs = new Map();
    this.init();
  }

  async init() {
    try {
      // Load all pending scheduled posts
      const pendingPosts = await ScheduledPost.find({ status: 'pending' });
      pendingPosts.forEach(post => {
        this.schedulePost(post);
      });
      console.log(`Initialized scheduler with ${pendingPosts.length} pending posts`);
    } catch (error) {
      console.error('Error initializing scheduler:', error);
    }
  }

  schedulePost(post) {
    if (this.jobs.has(post._id.toString())) {
      // Cancel existing job if it exists
      this.jobs.get(post._id.toString()).cancel();
    }

    // Don't schedule if the date is in the past
    if (new Date(post.scheduledDate) <= new Date()) {
      console.warn(`Post ${post._id} has a past schedule date, marking as failed`);
      this.markAsFailed(post._id, 'Scheduled date is in the past');
      return;
    }

    // Schedule new job
    const job = schedule.scheduleJob(post.scheduledDate, async () => {
      try {
        await this.publishPost(post);
      } catch (error) {
        console.error(`Error publishing post ${post._id}:`, error);
        await this.markAsFailed(post._id, error.message);
      }
    });

    this.jobs.set(post._id.toString(), job);
    console.log(`Scheduled post ${post._id} for ${post.scheduledDate}`);
  }

  async publishPost(post) {
    try {
      // Create a regular post from the scheduled post
      const newPost = new Post({
        userId: post.userId,
        topic: post.title,
        text: post.content,
        platform: post.platforms[0], // We're only using one platform for now
        scheduledDate: post.scheduledDate,
        mediaFileName: post.mediaUrl,
        status: 'published',
        publishedAt: new Date()
      });

      await newPost.save();

      // Update the scheduled post status
      await ScheduledPost.findByIdAndUpdate(post._id, {
        status: 'published',
        publishedAt: new Date()
      });

      // Remove the job from memory
      this.jobs.delete(post._id.toString());
      console.log(`Successfully published post ${post._id}`);
    } catch (error) {
      console.error(`Error in publishPost for ${post._id}:`, error);
      throw error;
    }
  }

  async markAsFailed(postId, errorMessage) {
    try {
      await ScheduledPost.findByIdAndUpdate(postId, {
        status: 'failed',
        error: errorMessage
      });
      this.jobs.delete(postId.toString());
    } catch (error) {
      console.error(`Error marking post ${postId} as failed:`, error);
    }
  }

  cancelScheduledPost(postId) {
    if (this.jobs.has(postId)) {
      this.jobs.get(postId).cancel();
      this.jobs.delete(postId);
      console.log(`Cancelled scheduled post ${postId}`);
    }
  }
}

// Create singleton instance
const scheduler = new PostScheduler();

module.exports = scheduler; 