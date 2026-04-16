"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardAnalytics = void 0;
const User_1 = __importDefault(require("../models/User"));
const Task_1 = __importDefault(require("../models/Task"));
const getDashboardAnalytics = async (req, res, next) => {
    try {
        const users = await User_1.default.find({ role: 'user' }).select('-passwordHash');
        // Fetch all users with their tasks
        const usersWithTasks = await Promise.all(users.map(async (user) => {
            const tasks = await Task_1.default.find({ user: user._id }).sort({ createdAt: -1 });
            return {
                ...user.toObject(),
                tasks
            };
        }));
        res.status(200).json({ success: true, data: usersWithTasks });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardAnalytics = getDashboardAnalytics;
//# sourceMappingURL=adminController.js.map