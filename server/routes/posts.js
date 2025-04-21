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
      mediaUrl: mediaFileName,
      status: 'pending'
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
    console.log('Fetching scheduled posts for user:', req.user.id);
    
    const posts = await ScheduledPost.find({
      userId: req.user.id
    }).sort({ scheduledDate: 'asc' });
    
    console.log('Found posts:', posts.length);
    console.log('Posts data:', JSON.stringify(posts, null, 2));
    
    res.json(posts);
  } catch (error) {
    console.error('Detailed error in scheduled posts:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Error fetching scheduled posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get analytics data
router.get('/analytics', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all posts for the user
    const posts = await Post.find({ userId });
    const scheduledPosts = await ScheduledPost.find({ userId });

    // Calculate total posts
    const totalPosts = posts.length + scheduledPosts.length;

    // Calculate engagement rate (example calculation)
    const totalEngagement = posts.reduce((sum, post) => {
      return sum + (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
    }, 0);
    const engagementRate = totalPosts > 0 ? (totalEngagement / totalPosts).toFixed(2) : 0;

    // Calculate platform statistics
    const platformStats = {};
    posts.forEach(post => {
      if (!platformStats[post.platform]) {
        platformStats[post.platform] = {
          postCount: 0,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0
        };
      }
      platformStats[post.platform].postCount++;
      platformStats[post.platform].totalLikes += post.likes || 0;
      platformStats[post.platform].totalComments += post.comments || 0;
      platformStats[post.platform].totalShares += post.shares || 0;
    });

    // Calculate averages for each platform
    Object.keys(platformStats).forEach(platform => {
      const stats = platformStats[platform];
      stats.avgLikes = (stats.totalLikes / stats.postCount).toFixed(1);
      stats.avgComments = (stats.totalComments / stats.postCount).toFixed(1);
      stats.avgShares = (stats.totalShares / stats.postCount).toFixed(1);
      stats.engagementRate = ((stats.totalLikes + stats.totalComments + stats.totalShares) / stats.postCount).toFixed(2);
    });

    // Get top performing posts
    const topPosts = [...posts]
      .sort((a, b) => {
        const engagementA = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
        const engagementB = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
        return engagementB - engagementA;
      })
      .slice(0, 5);

    // Calculate recent performance metrics
    const recentPerformance = [
      {
        label: 'Posts Last Week',
        value: posts.filter(post => {
          const postDate = new Date(post.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return postDate >= weekAgo;
        }).length,
        change: 10 // Example change percentage
      },
      {
        label: 'Average Engagement',
        value: engagementRate,
        change: 5 // Example change percentage
      },
      {
        label: 'Top Platform',
        value: Object.entries(platformStats)
          .sort(([, a], [, b]) => b.engagementRate - a.engagementRate)[0]?.[0] || 'N/A',
        change: 0
      },
      {
        label: 'Scheduled Posts',
        value: scheduledPosts.length,
        change: 15 // Example change percentage
      }
    ];

    res.json({
      totalPosts,
      engagementRate,
      platformStats,
      topPosts,
      recentPerformance
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

module.exports = router; 