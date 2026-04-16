import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { AdminDashboard } from '../components/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { error, message, clearMessages } = useTasks();

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 bg-orange-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-gray-600">Welcome back, {user?.name}</p>
      </header>

      {/* Global Task Notifications */}
      {(error || message) && (
        <div className={`mb-6 p-4 rounded-md border text-sm ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
          } flex justify-between items-center`}>
          <div>
            <span className="font-semibold mr-2">{error ? 'Error:' : 'Success:'}</span>
            {error || message}
          </div>
          <button onClick={clearMessages} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: User Context Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Account Summary
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex flex-col border-b border-gray-100 pb-3">
                <span className="text-gray-500 mb-1">Name</span>
                <span className="text-gray-900 font-medium">{user?.name}</span>
              </div>
              <div className="flex flex-col border-b border-gray-100 pb-3">
                <span className="text-gray-500 mb-1">Email</span>
                <span className="text-gray-900 font-medium">{user?.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 mb-1">Role</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main App Area */}
        <div className="lg:col-span-3">
          {user?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div className="space-y-8">
              <TaskForm />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Your Tasks
                  </h3>
                </div>
                <TaskList />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
