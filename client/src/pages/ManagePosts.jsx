import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const ManagePosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({
    topic: '',
    text: '',
    platform: 'Instagram',
    scheduledDate: '',
    mediaFileName: '',
    status: 'draft'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllPosts();
  }, [navigate]);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      console.log('Fetching all posts...');
      
      const [regularPostsResponse, scheduledPostsResponse] = await Promise.all([
        axiosInstance.get('/posts'),
        axiosInstance.get('/posts/scheduled')
      ]);

      console.log('Regular posts:', regularPostsResponse.data);
      console.log('Scheduled posts:', scheduledPostsResponse.data);

      setPosts(regularPostsResponse.data);
      setScheduledPosts(scheduledPostsResponse.data);
      setError('');
    } catch (err) {
      console.error('Error in fetchAllPosts:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch posts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, isScheduled = false) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      console.log('Deleting post:', postId);
      console.log('Is scheduled:', isScheduled);
      
      try {
        console.log('Attempting to delete regular post...');
        const response = await axiosInstance.delete(`/posts/${postId}`);
        console.log('Delete response:', response.data);
        setPosts(posts.filter(post => post._id !== postId));
        setError('');
        return;
      } catch (err) {
        console.log('Regular post delete failed, trying scheduled post...');
        const scheduledResponse = await axiosInstance.delete(`/posts/scheduled/${postId}`);
        console.log('Scheduled post delete response:', scheduledResponse.data);
        setScheduledPosts(scheduledPosts.filter(post => post._id !== postId));
        setError('');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to delete post. Please try again.');
    }
  };

  const handleEdit = (post) => {
    console.log('Editing post:', post);
    setEditingPost(post);
    
    setEditForm({
      topic: post.topic || '',
      text: post.text || '',
      platform: post.platform || 'Instagram',
      scheduledDate: post.scheduledDate ? new Date(post.scheduledDate).toISOString().split('T')[0] : '',
      mediaFileName: post.mediaFileName || '',
      status: post.status || 'draft'
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editForm.topic || !editForm.text || !editForm.platform) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const updateData = {
        topic: editForm.topic,
        text: editForm.text,
        platform: editForm.platform,
        scheduledDate: editForm.scheduledDate ? new Date(editForm.scheduledDate).toISOString() : null,
        mediaFileName: editForm.mediaFileName || '',
        status: editForm.status
      };
      
      console.log('Sending update with data:', updateData);
      
      const response = await axiosInstance.put(`/posts/${editingPost._id}`, updateData);
      
      setPosts(posts.map(post => 
        post._id === editingPost._id ? response.data : post
      ));
      
      setEditingPost(null);
      setError('');
    } catch (err) {
      console.error('Update error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.message || 'Failed to update post. Please check all fields and try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const allPosts = [...posts, ...scheduledPosts];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Posts</h1>
        <button
          onClick={() => navigate('/create-post')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create New Post
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {allPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found. Create your first post!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map(post => (
            <div key={post._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{post.topic || 'Untitled Post'}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(post._id, post.scheduledDate)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{post.text}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                  {post.platform}
                </span>
              </div>

              {post.scheduledDate && (
                <p className="text-sm text-gray-500">
                  Scheduled for: {new Date(post.scheduledDate).toLocaleDateString()}
                </p>
              )}

              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Status: {post.status || 'draft'}</span>
                {post.metrics && <span>Likes: {post.metrics.likes || 0}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Topic</label>
                  <input
                    type="text"
                    name="topic"
                    value={editForm.topic}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    name="text"
                    value={editForm.text}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Platform</label>
                  <select
                    name="platform"
                    value={editForm.platform}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={editForm.scheduledDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePosts; 