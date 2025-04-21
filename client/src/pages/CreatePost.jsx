import { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    text: '',
    platform: 'Instagram',
    scheduledDate: '',
    mediaFileName: '',
    topic: '',
    tone: 'friendly'
  });

  const [aiGeneratedContent, setAiGeneratedContent] = useState({
    post: '',
    hashtags: '',
    rewritten: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneratePost = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/ai/generate-post', {
        topic: formData.topic,
        tone: formData.tone,
        platform: formData.platform
      });
      setAiGeneratedContent(prev => ({
        ...prev,
        post: response.data.text
      }));
      setFormData(prev => ({
        ...prev,
        text: response.data.text
      }));
    } catch (error) {
      console.error('Error generating post:', error);
    }
  };

  const handleGenerateHashtags = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/ai/generate-hashtags', {
        topic: formData.topic,
        platform: formData.platform
      });
      setAiGeneratedContent(prev => ({
        ...prev,
        hashtags: response.data.suggestions
      }));
    } catch (error) {
      console.error('Error generating hashtags:', error);
    }
  };

  const handleRewritePost = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/ai/rewrite-post', {
        caption: formData.text
      });
      setAiGeneratedContent(prev => ({
        ...prev,
        rewritten: response.data.text
      }));
      setFormData(prev => ({
        ...prev,
        text: response.data.text
      }));
    } catch (error) {
      console.error('Error rewriting post:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/posts', {
        ...formData,
        aiGenerated: !!aiGeneratedContent.post
      });
      // Reset form
      setFormData({
        text: '',
        platform: 'Instagram',
        scheduledDate: '',
        mediaFileName: '',
        topic: '',
        tone: 'friendly'
      });
      setAiGeneratedContent({
        post: '',
        hashtags: '',
        rewritten: ''
      });
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Platform</label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Facebook">Facebook</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="What's your post about?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tone</label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
          </select>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGeneratePost}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Post with AI
          </button>
          <button
            type="button"
            onClick={handleGenerateHashtags}
            className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Hashtags
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Post Text</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Write your post here..."
          />
          <button
            type="button"
            onClick={handleRewritePost}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Rewrite My Caption
          </button>
        </div>

        {aiGeneratedContent.hashtags && (
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700">AI Generated Hashtags</h3>
            <p className="mt-1 text-sm text-gray-600">{aiGeneratedContent.hashtags}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Schedule Date & Time</label>
          <input
            type="datetime-local"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Media File (Optional)</label>
          <input
            type="text"
            name="mediaFileName"
            value={formData.mediaFileName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter media file name"
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Schedule Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost; 