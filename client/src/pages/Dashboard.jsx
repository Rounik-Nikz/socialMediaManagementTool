import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import {
  ChartBarIcon,
  CalendarIcon,
  DocumentPlusIcon,
  PencilSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    platformBreakdown: {},
  });
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [postsResponse] = await Promise.all([
        axiosInstance.get('/posts'),
      ]);

      const posts = postsResponse.data;
      
      // Calculate stats
      const scheduled = posts.filter(post => post.scheduledDate && new Date(post.scheduledDate) > new Date()).length;
      const platformCounts = posts.reduce((acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalPosts: posts.length,
        scheduledPosts: scheduled,
        platformBreakdown: platformCounts,
      });

      // Get 5 most recent posts
      const recent = [...posts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentPosts(recent);
      
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'failed': return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'pending': return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      default: return null;
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
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage and monitor your social media posts across all platforms
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPosts}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Used Platform</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.entries(stats.platformBreakdown).reduce((a, b) => 
                  (stats.platformBreakdown[a] || 0) > stats.platformBreakdown[b] ? a : b[0], '')}
              </p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Count</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.keys(stats.platformBreakdown).length}
              </p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/create-post')}
            className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-md hover:bg-gray-50"
          >
            <DocumentPlusIcon className="w-5 h-5 text-indigo-500" />
            <span>Create Post</span>
          </button>
          <button
            onClick={() => navigate('/calendar')}
            className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-md hover:bg-gray-50"
          >
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
            <span>View Calendar</span>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-md hover:bg-gray-50"
          >
            <ChartBarIcon className="w-5 h-5 text-indigo-500" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => navigate('/manage-posts')}
            className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-md hover:bg-gray-50"
          >
            <PencilSquareIcon className="w-5 h-5 text-indigo-500" />
            <span>Manage Posts</span>
          </button>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Posts</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {recentPosts.map((post) => (
              <div key={post._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0">
                      {getStatusIcon(post.status)}
                    </span>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {post.topic || 'Untitled Post'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {post.text?.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;