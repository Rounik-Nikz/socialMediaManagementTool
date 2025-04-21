import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState({
    totalPosts: 0,
    engagementRate: 0,
    platformStats: {},
    recentPerformance: [],
    topPosts: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAnalytics();
  }, [navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/posts/analytics');
      setMetrics(response.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch analytics data');
        console.error('Error fetching analytics:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-indigo-600 mb-2">Total Posts</h3>
          <p className="text-3xl font-bold text-gray-800">{metrics.totalPosts}</p>
          <p className="text-sm text-gray-600 mt-2">Across all platforms</p>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-2">Engagement Rate</h3>
          <p className="text-3xl font-bold text-gray-800">{metrics.engagementRate}%</p>
          <p className="text-sm text-gray-600 mt-2">Average across all posts</p>
        </div>

        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-600 mb-2">Best Platform</h3>
          <p className="text-3xl font-bold text-gray-800">
            {Object.entries(metrics.platformStats)
              .sort(([, a], [, b]) => b.engagementRate - a.engagementRate)[0]?.[0] || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-2">Highest engagement</p>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Platform Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(metrics.platformStats).map(([platform, stats]) => (
            <div key={platform} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{platform}</span>
                <span className="text-sm text-gray-500">{stats.postCount} posts</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${stats.engagementRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stats.engagementRate}%</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Average Likes</span>
                  <p className="text-lg font-semibold text-gray-800">{stats.avgLikes}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Average Comments</span>
                  <p className="text-lg font-semibold text-gray-800">{stats.avgComments}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Performing Posts</h3>
        <div className="space-y-4">
          {metrics.topPosts.map((post, index) => (
            <div key={post._id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                  <span className="font-medium text-gray-700">{post.platform}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Likes</span>
                  <p className="font-semibold text-gray-800">{post.likes}</p>
                </div>
                <div>
                  <span className="text-gray-500">Comments</span>
                  <p className="font-semibold text-gray-800">{post.comments}</p>
                </div>
                <div>
                  <span className="text-gray-500">Shares</span>
                  <p className="font-semibold text-gray-800">{post.shares}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Performance */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Performance</h3>
        <div className="bg-white border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.recentPerformance.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className={`text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 