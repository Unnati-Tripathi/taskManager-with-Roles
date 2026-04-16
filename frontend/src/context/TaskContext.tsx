import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  message: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: { title: string; description?: string; status?: string }) => Promise<boolean>;
  updateTask: (id: string, data: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  clearMessages: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1/tasks',
    headers: { Authorization: `Bearer ${token}` }
  });

  const clearMessages = () => {
    setError(null);
    setMessage(null);
  };

  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get('/');
      setTasks(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, token]);

  const createTask = async (data: any) => {
    try {
      clearMessages();
      const res = await api.post('/', data);
      setTasks([res.data.data, ...tasks]);
      setMessage('Task created successfully');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to create task');
      return false;
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      clearMessages();
      const res = await api.put(`/${id}`, data);
      setTasks(tasks.map(t => t._id === id ? res.data.data : t));
      setMessage('Task updated successfully');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      clearMessages();
      await api.delete(`/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      setMessage('Task deleted successfully');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
      return false;
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, error, message, fetchTasks, createTask, updateTask, deleteTask, clearMessages }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
