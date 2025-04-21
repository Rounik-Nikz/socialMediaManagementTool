const express = require('express');
const router = express.Router();
const {
  generatePost,
  generateHashtagsAndEmojis,
  rewritePost,
  analyzeMetrics
} = require('../utils/geminiHelper');

// Error handling middleware
const handleError = (res, error) => {
  console.error('AI Route Error:', error);
  if (error.message.includes('Rate limit')) {
    return res.status(429).json({ message: error.message });
  } else if (error.message.includes('API key') || error.message.includes('quota')) {
    return res.status(403).json({ message: error.message });
  } else {
    return res.status(500).json({ message: 'An error occurred while processing your request' });
  }
};

// Generate a new post
router.post('/generate-post', async (req, res) => {
  try {
    const { topic, tone, platform } = req.body;
    if (!topic || !tone || !platform) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const generatedPost = await generatePost(topic, tone, platform);
    res.json({ text: generatedPost });
  } catch (error) {
    handleError(res, error);
  }
});

// Generate hashtags and emojis
router.post('/generate-hashtags', async (req, res) => {
  try {
    const { topic, platform } = req.body;
    if (!topic || !platform) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const suggestions = await generateHashtagsAndEmojis(topic, platform);
    res.json({ suggestions });
  } catch (error) {
    handleError(res, error);
  }
});

// Rewrite a post
router.post('/rewrite-post', async (req, res) => {
  try {
    const { caption } = req.body;
    if (!caption) {
      return res.status(400).json({ message: 'Caption is required' });
    }
    const rewrittenPost = await rewritePost(caption);
    res.json({ text: rewrittenPost });
  } catch (error) {
    handleError(res, error);
  }
});

// Analyze metrics
router.post('/analyze-metrics', async (req, res) => {
  try {
    const { metrics } = req.body;
    if (!metrics || !metrics.likes || !metrics.reach || !metrics.comments) {
      return res.status(400).json({ message: 'Invalid metrics data' });
    }
    const analysis = await analyzeMetrics(metrics);
    res.json({ analysis });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router; 