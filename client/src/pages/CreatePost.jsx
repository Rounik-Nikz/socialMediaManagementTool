import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { SparklesIcon } from '@heroicons/react/24/outline';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    text: '',
    platform: '',
    scheduledDate: '',
    mediaFileName: '',
    aiGenerated: false,
    tone: 'professional' // Default tone
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateWithAI = async () => {
    if (!formData.topic) {
      setError('Please enter a topic to generate content');
      return;
    }

    if (!formData.platform) {
      setError('Please select a platform to generate content');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      const response = await axiosInstance.post('/ai/generate-post', {
        topic: formData.topic,
        platform: formData.platform,
        tone: formData.tone
      });

      setFormData(prev => ({
        ...prev,
        text: response.data.text,
        aiGenerated: true
      }));
    } catch (err) {
      console.error('Error generating content:', err);
      setError(err.response?.data?.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.text || !formData.platform) {
        throw new Error('Text and platform are required');
      }

      // If scheduled date is provided, validate it's in the future
      if (formData.scheduledDate) {
        const scheduledDate = new Date(formData.scheduledDate);
        if (scheduledDate <= new Date()) {
          throw new Error('Scheduled date must be in the future');
        }
      }

      const response = await axiosInstance.post('/posts', formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Topic
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="topic"
                  id="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter post topic"
                />
                <button
                  type="button"
                  onClick={generateWithAI}
                  disabled={isGenerating || !formData.topic || !formData.platform}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a platform</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>

            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                Tone
              </label>
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="humorous">Humorous</option>
                <option value="inspirational">Inspirational</option>
              </select>
            </div>

            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <div className="mt-1">
                <textarea
                  id="text"
                  name="text"
                  rows={4}
                  value={formData.text}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Enter post content"
                />
              </div>
            </div>

            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
                Schedule Post (Optional)
              </label>
              <input
                type="datetime-local"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div>
              <label htmlFor="mediaFileName" className="block text-sm font-medium text-gray-700">
                Media File (Optional)
              </label>
              <input
                type="text"
                id="mediaFileName"
                name="mediaFileName"
                value={formData.mediaFileName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter media file name"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 