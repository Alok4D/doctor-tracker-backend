import { Server } from 'http';
import app from './app';
import config from './app/config';
import { connectDB } from './app/utils/connectDB';

let server: Server;

async function main() {
  try {
    await connectDB();

    server = app.listen(config.port || 5000, () => {
      console.log(`app is listening on port ${config.port || 5000}`);
    });
  } catch (err) {
    console.log(err);
  }
}

// Only start an HTTP listener when running outside Vercel Serverless runtime
if (!process.env.VERCEL) {
  main();

  process.on('unhandledRejection', () => {
    console.log(`😈 unhandledRejection is detected, shutting down...`);
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    }
    process.exit(1);
  });

  process.on('uncaughtException', () => {
    console.log(`😈 uncaughtException is detected, shutting down...`);
    process.exit(1);
  });
}

export default app;
