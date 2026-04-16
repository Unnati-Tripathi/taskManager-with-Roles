import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import adminRoutes from './routes/admin';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// API versioning
const API_PREFIX = '/api/v1';

// Swagger setup
try {
  const fileContent = fs.readFileSync(path.join(__dirname, '../swagger.yaml'), 'utf8');
  const swaggerDocument = yaml.parse(fileContent);
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.log('Swagger setup failed, swagger.yaml might be missing.');
}

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/tasks`, taskRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);

// Health check
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({ status: 'ok' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Database connection
import User from './models/User';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('1234', salt);
      await User.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        passwordHash,
        role: 'admin'
      });
      console.log('Admin account (admin@gmail.com / 1234) created successfully');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/assignment2';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
    await seedAdmin();
  } catch (error) {
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
