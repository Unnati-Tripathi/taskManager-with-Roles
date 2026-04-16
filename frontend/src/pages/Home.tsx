import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl text-center space-y-8">
        <div className="inline-block px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-semibold tracking-wide uppercase border border-orange-500/20 mb-2">
          Task Management Solved
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-orange-900 tracking-tight leading-tight">
          Manage your tasks with <span className="text-orange-400">AceDreams</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          A simple, powerful, and elegant workspace to track your daily goals and organize your life without distractions.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-orange-500 hover:bg-orange-400 rounded-md shadow-sm transition-colors"
          >
            Create an account
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-orange-500 hover:bg-orange-400 border border-orange-500 hover:border-orange-400 rounded-md shadow-sm transition-all"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
