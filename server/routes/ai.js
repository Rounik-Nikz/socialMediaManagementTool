const express = require('express');
const router = express.Router();
const {
  generatePost,
  generateHashtagsAndEmojis,
  rewritePost,
  analyzeMetrics
} = require('../utils/geminiHelper');

// Generate a new post
router.post('/generate-post', async (req, res) => {
  try {
    const { topic, tone, platform } = req.body;
    const generatedPost = await generatePost(topic, tone, platform);
    res.json({ text: generatedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate hashtags and emojis
router.post('/generate-hashtags', async (req, res) => {
  try {
    const { topic, platform } = req.body;
    const suggestions = await generateHashtagsAndEmojis(topic, platform);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rewrite a post
router.post('/rewrite-post', async (req, res) => {
  try {
    const { caption } = req.body;
    const rewrittenPost = await rewritePost(caption);
    res.json({ text: rewrittenPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analyze metrics
router.post('/analyze-metrics', async (req, res) => {
  try {
    const { metrics } = req.body;
    const analysis = await analyzeMetrics(metrics);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 