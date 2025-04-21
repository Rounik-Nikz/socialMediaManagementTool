const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const generatePost = async (topic, tone, platform) => {
  const prompt = `Write a social media post about ${topic} in a ${tone} tone for ${platform}. Keep it short and engaging.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const generateHashtagsAndEmojis = async (topic, platform) => {
  const prompt = `Suggest 5 relevant hashtags and 3 emojis for a social media post about ${topic} on ${platform}.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const rewritePost = async (caption) => {
  const prompt = `Rewrite this caption to be more engaging and catchy: ${caption}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const analyzeMetrics = async (metrics) => {
  const prompt = `Create a short performance summary based on this post data: Likes: ${metrics.likes}, Reach: ${metrics.reach}, Comments: ${metrics.comments}. Suggest one way to improve future posts.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = {
  generatePost,
  generateHashtagsAndEmojis,
  rewritePost,
  analyzeMetrics
}; 