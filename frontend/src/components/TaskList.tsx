import React, { useState } from 'react';
import { useTasks, type Task } from '../context/TaskContext';

export const TaskList: React.FC = () => {
  const { tasks, loading, updateTask, deleteTask } = useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const startEdit = (task: Task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDesc(task.description || '');
  };

  const saveEdit = async (id: string) => {
    const success = await updateTask(id, { title: editTitle, description: editDesc });
    if (success) setEditingId(null);
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border bg-white border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border bg-white border-blue-200',
    completed: 'bg-green-100 text-green-800 border bg-white border-green-200',
  };

  if (loading && tasks.length === 0) {
    return <div className="text-center py-6 text-gray-500">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
        <h3 className="text-sm font-medium text-gray-900">No tasks</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {tasks.map(task => (
          <li key={task._id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors">
            {editingId === task._id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                   <button onClick={() => setEditingId(null)} className="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white rounded-md text-sm font-medium hover:bg-gray-50">Cancel</button>
                   <button onClick={() => saveEdit(task._id)} className="px-3 py-1.5 border border-transparent bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Save</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{task.title}</h4>
                    {task.description && <p className="mt-1 text-sm text-gray-600">{task.description}</p>}
                    <p className="mt-2 text-xs text-gray-400">Created on {new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <select
                      value={task.status}
                      onChange={(e) => updateTask(task._id, { status: e.target.value as any })}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColors[task.status]}`}
                    >
                      <option value="pending" className="text-gray-900 bg-white">Pending</option>
                      <option value="in-progress" className="text-gray-900 bg-white">In Progress</option>
                      <option value="completed" className="text-gray-900 bg-white">Completed</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(task)} className="text-gray-400 hover:text-blue-600 px-1">
                        <span className="sr-only">Edit</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button onClick={() => deleteTask(task._id)} className="text-gray-400 hover:text-red-600 px-1">
                        <span className="sr-only">Delete</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
