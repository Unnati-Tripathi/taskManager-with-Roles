import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { type Task } from '../context/TaskContext';

interface UserWithTasks {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  tasks: Task[];
}

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.data);
      } catch (err: any) {
        setError('Failed to fetch admin data. Not authorized.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  if (loading) return <div className="text-center py-6 text-orange-500">Loading comprehensive analytics...</div>;
  if (error) return <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200 font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-orange-200 p-6 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-orange-900">System Overview</h2>
          <p className="text-sm text-orange-500">Monitoring all active users and their task schedules</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-900">{users.length}</div>
          <div className="text-xs uppercase tracking-wider text-orange-500 font-medium">Total Users</div>
        </div>
      </div>

      <div className="grid gap-6">
        {users.length === 0 ? (
          <div className="text-center py-12 bg-orange-50 rounded-lg border border-orange-200 border-dashed">
            <h3 className="text-sm font-medium text-orange-900">No users found</h3>
          </div>
        ) : (
          users.map(user => (
            <div key={user._id} className="bg-white rounded-lg border border-orange-200 overflow-hidden shadow-sm">
              <div className="bg-orange-50 p-4 border-b border-orange-200 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold text-orange-900">{user.name}</h3>
                  <p className="text-xs text-orange-500">{user.email} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {user.tasks.length} Tasks
                </div>
              </div>
              <div className="p-4 bg-white">
                {user.tasks.length === 0 ? (
                  <p className="text-sm text-orange-500">No tasks scheduled.</p>
                ) : (
                  <ul className="space-y-3">
                    {user.tasks.map(task => (
                      <li key={task._id} className="flex items-start gap-3 text-sm">
                        <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'completed' ? 'bg-green-400' :
                            task.status === 'in-progress' ? 'bg-blue-400' : 'bg-yellow-400'
                          }`} />
                        <div className="flex-1">
                          <p className="font-medium text-orange-900">{task.title}</p>
                          {task.description && <p className="text-xs text-orange-500 mt-0.5">{task.description}</p>}
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-orange-500 bg-orange-100 px-2 py-0.5 rounded">
                          {task.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
