import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-sm transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 px-4 bg-white border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">
              Social Media Manager
            </h1>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === '/dashboard'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 ${
                location.pathname === '/dashboard'
                  ? 'bg-indigo-100'
                  : 'bg-indigo-50 group-hover:bg-indigo-100'
              }`}>
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link
              to="/create-post"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === '/create-post'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 ${
                location.pathname === '/create-post'
                  ? 'bg-indigo-100'
                  : 'bg-indigo-50 group-hover:bg-indigo-100'
              }`}>
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-medium">Create Post</span>
            </Link>
            
            <Link
              to="/calendar"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === '/calendar'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 ${
                location.pathname === '/calendar'
                  ? 'bg-indigo-100'
                  : 'bg-indigo-50 group-hover:bg-indigo-100'
              }`}>
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium">Calendar</span>
            </Link>
            
            <Link
              to="/analytics"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === '/analytics'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 ${
                location.pathname === '/analytics'
                  ? 'bg-indigo-100'
                  : 'bg-indigo-50 group-hover:bg-indigo-100'
              }`}>
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-medium">Analytics</span>
            </Link>

            <Link
              to="/manage-posts"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === '/manage-posts'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 ${
                location.pathname === '/manage-posts'
                  ? 'bg-indigo-100'
                  : 'bg-indigo-50 group-hover:bg-indigo-100'
              }`}>
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="font-medium">Manage Posts</span>
            </Link>
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg mr-3 group-hover:bg-red-100">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-72">
        {/* Mobile menu button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 hover:text-gray-600 focus:outline-none bg-white rounded-lg shadow-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 