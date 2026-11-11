import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorSources: { path: string | number; message: string }[] = [
    {
      path: '',
      message: err.message || 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorSources = err.issues.map((issue) => ({
      path: String(issue.path[issue.path.length - 1] ?? ''),
      message: issue.message,
    }));
  } else if (err?.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    errorSources = [
      {
        path: String(err.path || ''),
        message: err.message,
      },
    ];
  } else if (err?.code === 11000) {
    statusCode = 400;
    message = 'Duplicate Key Error';
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    errorSources = [
      {
        path: Object.keys(err.keyPattern || {})[0] || '',
        message: `${extractedMessage} already exists`,
      },
    ];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
