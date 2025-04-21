const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Check if API key is present
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 60, // Free tier limit per minute
  timeWindow: 60000, // 1 minute in milliseconds
  requests: []
};

const checkRateLimit = () => {
  const now = Date.now();
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(time => now - time < RATE_LIMIT.timeWindow);
  
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  RATE_LIMIT.requests.push(now);
};

const handleGeminiError = (error) => {
  if (error.message.includes('API key')) {
    throw new Error('Invalid Gemini API key. Please check your configuration.');
  } else if (error.message.includes('quota')) {
    throw new Error('API quota exceeded. Please check your usage limits.');
  } else {
    throw new Error(`Gemini API error: ${error.message}`);
  }
};

const generatePost = async (topic, tone, platform) => {
  try {
    checkRateLimit();
    const prompt = `Write a social media post about ${topic} in a ${tone} tone for ${platform}. Keep it short and engaging.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    handleGeminiError(error);
  }
};

const generateHashtagsAndEmojis = async (topic, platform) => {
  try {
    checkRateLimit();
    const prompt = `Suggest 5 relevant hashtags and 3 emojis for a social media post about ${topic} on ${platform}.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    handleGeminiError(error);
  }
};

const rewritePost = async (caption) => {
  try {
    checkRateLimit();
    const prompt = `Rewrite this caption to be more engaging and catchy: ${caption}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    handleGeminiError(error);
  }
};

const analyzeMetrics = async (metrics) => {
  try {
    checkRateLimit();
    const prompt = `Create a short performance summary based on this post data: Likes: ${metrics.likes}, Reach: ${metrics.reach}, Comments: ${metrics.comments}. Suggest one way to improve future posts.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    handleGeminiError(error);
  }
};

module.exports = {
  generatePost,
  generateHashtagsAndEmojis,
  rewritePost,
  analyzeMetrics
}; 