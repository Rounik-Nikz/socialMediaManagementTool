import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({
    platform: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      let url = 'http://localhost:5000/api/posts';
      if (filter.platform !== 'all') {
        url = `http://localhost:5000/api/posts/platform/${filter.platform}`;
      } else if (filter.status !== 'all') {
        url = `http://localhost:5000/api/posts/status/${filter.status}`;
      }
      const response = await axios.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          <select
            value={filter.platform}
            onChange={(e) => setFilter({ ...filter, platform: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Facebook">Facebook</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="posted">Posted</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{post.platform}</h3>
                <p className="text-sm text-gray-500">
                  Scheduled for: {new Date(post.scheduledDate).toLocaleString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                post.status === 'posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {post.status}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{post.text}</p>
            {post.mediaFileName && (
              <p className="mt-2 text-sm text-gray-500">Media: {post.mediaFileName}</p>
            )}
            {post.aiGenerated && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                AI Generated
              </span>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleDelete(post._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 