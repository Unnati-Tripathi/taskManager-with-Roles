import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-orange-900 border-b border-orange-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-orange-100 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center text-black text-sm">
                A
              </div>
              AceDreams
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-orange-400 hover:text-orange-100 transition-colors">Home</Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-orange-400 hover:text-orange-100 transition-colors">Dashboard</Link>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-orange-800 rounded-full border border-orange-700">
                  <span className="text-xs text-orange-400">Welcome,</span>
                  <span className="text-sm font-medium text-orange-200">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-orange-300 hover:text-white bg-orange-800 hover:bg-orange-700 border border-orange-700 rounded-md transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">Sign in</Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-md transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
