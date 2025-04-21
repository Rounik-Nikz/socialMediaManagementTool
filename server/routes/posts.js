const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const ScheduledPost = require('../models/ScheduledPost');
const scheduler = require('../services/scheduler');

// Get all posts for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { topic, text, platform, scheduledDate, mediaFileName, aiGenerated } = req.body;

    // Validate required fields
    if (!text || !platform) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const post = new Post({
      userId: req.user.id,
      topic,
      text,
      platform,
      scheduledDate: scheduledDate || new Date(),
      mediaFileName,
      aiGenerated: aiGenerated || false,
      status: 'draft'
    });

    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get posts by platform for the authenticated user
router.get('/platform/:platform', auth, async (req, res) => {
  try {
    const posts = await Post.find({
      userId: req.user.id,
      platform: req.params.platform
    }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts by status for the authenticated user
router.get('/status/:status', auth, async (req, res) => {
  try {
    const posts = await Post.find({
      userId: req.user.id,
      status: req.params.status
    }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a post
router.patch('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const allowedUpdates = ['topic', 'text', 'platform', 'scheduledDate', 'mediaFileName', 'status'];
    const updates = Object.keys(req.body);
    
    updates.forEach(update => {
      if (allowedUpdates.includes(update)) {
        post[update] = req.body[update];
      }
    });

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a scheduled post
router.post('/scheduled', auth, async (req, res) => {
  try {
    const { topic, text, platform, scheduledDate, mediaFileName } = req.body;

    // Validate required fields
    if (!text || !platform || !scheduledDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate scheduledDate is in the future
    if (new Date(scheduledDate) <= new Date()) {
      return res.status(400).json({ message: 'Scheduled date must be in the future' });
    }

    const post = new ScheduledPost({
      userId: req.user.id,
      title: topic,
      content: text,
      platforms: [platform.toLowerCase()],
      scheduledDate,
      mediaUrl: mediaFileName
    });

    await post.save();
    scheduler.schedulePost(post);

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating scheduled post:', error);
    res.status(500).json({ message: 'Error creating scheduled post' });
  }
});

// Get all scheduled posts for the authenticated user
router.get('/scheduled', auth, async (req, res) => {
  try {
    const posts = await ScheduledPost.find({
      userId: req.user.id,
      status: 'pending'
    }).sort({ scheduledDate: 'asc' });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    res.status(500).json({ message: 'Error fetching scheduled posts' });
  }
});

module.exports = router; 