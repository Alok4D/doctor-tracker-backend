import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

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
