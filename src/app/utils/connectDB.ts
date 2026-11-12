import mongoose from 'mongoose';
import config from '../config';

let cachedConnection: Promise<typeof mongoose> | null = null;

/**
 * Establishes and caches a MongoDB connection across serverless invocations
 * to prevent connection exhaustion and minimize cold-start latency.
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!cachedConnection) {
    cachedConnection = mongoose.connect(config.database_url as string);
  }

  try {
    await cachedConnection;
    return mongoose;
  } catch (error) {
    cachedConnection = null;
    throw error;
  }
};

