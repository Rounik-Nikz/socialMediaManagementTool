import { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [aiInsights, setAiInsights] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleGetInsights = async (post) => {
    try {
      const response = await axios.post('http://localhost:5000/api/ai/analyze-metrics', {
        metrics: post.metrics
      });
      setAiInsights(response.data.analysis);
      setSelectedPost(post);
    } catch (error) {
      console.error('Error getting AI insights:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Posts Performance</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{post.platform}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.scheduledDate).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleGetInsights(post)}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Get AI Insights
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{post.metrics.likes}</p>
                    <p className="text-sm text-gray-500">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{post.metrics.reach}</p>
                    <p className="text-sm text-gray-500">Reach</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{post.metrics.comments}</p>
                    <p className="text-sm text-gray-500">Comments</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          {selectedPost && (
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="font-medium mb-2">
                {selectedPost.platform} Post from {new Date(selectedPost.scheduledDate).toLocaleString()}
              </h3>
              <p className="text-gray-700 mb-4">{selectedPost.text}</p>
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium mb-2">AI Analysis</h4>
                <p className="text-gray-700">{aiInsights}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 