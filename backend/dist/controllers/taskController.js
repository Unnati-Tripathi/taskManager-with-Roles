"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const zod_1 = require("zod");
const Task_1 = __importDefault(require("../models/Task"));
const taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(100),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['pending', 'in-progress', 'completed']).optional(),
});
const createTask = async (req, res, next) => {
    try {
        const validatedData = taskSchema.parse(req.body);
        const taskData = { ...validatedData };
        if (taskData.description === undefined)
            delete taskData.description;
        if (taskData.status === undefined)
            delete taskData.status;
        const task = await Task_1.default.create({
            ...taskData,
            user: req.user.id,
        });
        res.status(201).json({ success: true, data: task });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, errors: error.issues });
            return;
        }
        next(error);
    }
};
exports.createTask = createTask;
const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task_1.default.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    }
    catch (error) {
        next(error);
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res, next) => {
    try {
        const task = await Task_1.default.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }
        res.status(200).json({ success: true, data: task });
    }
    catch (error) {
        next(error);
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res, next) => {
    try {
        const validatedData = taskSchema.partial().parse(req.body);
        const task = await Task_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, validatedData, { new: true, runValidators: true });
        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }
        res.status(200).json({ success: true, data: task });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, errors: error.issues });
            return;
        }
        next(error);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task_1.default.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }
        res.status(200).json({ success: true, data: {} });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=taskController.js.map