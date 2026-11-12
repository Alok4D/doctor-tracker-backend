import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import { connectDB } from './app/utils/connectDB';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Ensure database connection is ready in serverless environments
app.use('/api/v1', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Application routes under /api/v1
app.use('/api/v1', router);

// Root route for health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Doctor Tracker Backend API Server!',
    timestamp: new Date().toISOString(),
    documentation: '/api/v1',
  });
});

// Error handling middlewares
app.use(globalErrorHandler);
app.use(notFound);

export default app;
