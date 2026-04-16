"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const admin_1 = __importDefault(require("./routes/admin"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// API versioning
const API_PREFIX = '/api/v1';
// Swagger setup
try {
    const fileContent = fs_1.default.readFileSync(path_1.default.join(__dirname, '../swagger.yaml'), 'utf8');
    const swaggerDocument = yaml_1.default.parse(fileContent);
    app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
}
catch (e) {
    console.log('Swagger setup failed, swagger.yaml might be missing.');
}
// Routes
app.use(`${API_PREFIX}/auth`, auth_1.default);
app.use(`${API_PREFIX}/tasks`, tasks_1.default);
app.use(`${API_PREFIX}/admin`, admin_1.default);
// Health check
app.get(`${API_PREFIX}/health`, (req, res) => {
    res.json({ status: 'ok' });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});
// Database connection
const User_1 = __importDefault(require("./models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedAdmin = async () => {
    try {
        const existingAdmin = await User_1.default.findOne({ email: 'admin@gmail.com' });
        if (!existingAdmin) {
            const salt = await bcryptjs_1.default.genSalt(10);
            const passwordHash = await bcryptjs_1.default.hash('1234', salt);
            await User_1.default.create({
                name: 'Admin',
                email: 'admin@gmail.com',
                passwordHash,
                role: 'admin'
            });
            console.log('Admin account (admin@gmail.com / 1234) created successfully');
        }
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
    }
};
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/assignment2';
        await mongoose_1.default.connect(mongoUri);
        console.log('MongoDB connected successfully');
        await seedAdmin();
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
//# sourceMappingURL=index.js.map