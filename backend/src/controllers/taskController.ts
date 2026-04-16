import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Task from '../models/Task';

declare module 'express' {
  export interface Request {
    user?: any; // Assuming `user` from auth midleware is attached
  }
}

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
});

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = taskSchema.parse(req.body);

    const taskData = { ...validatedData };
    if (taskData.description === undefined) delete taskData.description;
    if (taskData.status === undefined) delete taskData.status;

    const task = await Task.create({
      ...(taskData as any),
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id as string, user: req.user.id });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = taskSchema.partial().parse(req.body);
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id as string, user: req.user.id },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.status(200).json({ success: true, data: task });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id as string, user: req.user.id });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
