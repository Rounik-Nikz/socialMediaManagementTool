const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ scheduledDate: 1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  const post = new Post({
    text: req.body.text,
    platform: req.body.platform,
    scheduledDate: req.body.scheduledDate,
    mediaFileName: req.body.mediaFileName,
    aiGenerated: req.body.aiGenerated
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get posts by platform
router.get('/platform/:platform', async (req, res) => {
  try {
    const posts = await Post.find({ platform: req.params.platform }).sort({ scheduledDate: 1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts by status
router.get('/status/:status', async (req, res) => {
  try {
    const posts = await Post.find({ status: req.params.status }).sort({ scheduledDate: 1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a post
router.patch('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    Object.keys(req.body).forEach(key => {
      if (post[key] !== undefined) {
        post[key] = req.body[key];
      }
    });

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 