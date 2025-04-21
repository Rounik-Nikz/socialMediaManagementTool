import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CalendarView from '../pages/CalendarView';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calendar');

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-white shadow-xl h-screen fixed">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Social Media Manager</h1>
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'calendar' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('calendar')}
              >
                Calendar
              </Link>
              <Link
                to="/create-post"
                className="block px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Create Post
              </Link>
            </nav>
            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-72 p-8 w-full">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'calendar' && <CalendarView />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;