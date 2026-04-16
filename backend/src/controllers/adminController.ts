import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Task from '../models/Task';

export const getDashboardAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find({ role: 'user' }).select('-passwordHash');
    
    // Fetch all users with their tasks
    const usersWithTasks = await Promise.all(
      users.map(async (user) => {
        const tasks = await Task.find({ user: user._id }).sort({ createdAt: -1 });
        return {
          ...user.toObject(),
          tasks
        };
      })
    );

    res.status(200).json({ success: true, data: usersWithTasks });
  } catch (error) {
    next(error);
  }
};
