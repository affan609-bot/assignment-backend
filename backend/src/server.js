import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';

const port = Number(process.env.PORT) || 5000;

let server;

const startServer = async () => {
  try {
    // Pehle database connect, phir server listen.
    await connectDB();

    server = app.listen(port, () => {
      console.log('');
      console.log('  Products Admin API');
      console.log(`  URL     http://localhost:${port}`);
      console.log(`  Health  http://localhost:${port}/api/health`);
      console.log('');
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `Port ${port} is already in use. Change PORT in backend/.env.`
        );
        process.exit(1);
      }

      throw error;
    });
  } catch (error) {
    console.error('Server start failed:', error.message);
    process.exit(1);
  }
};

/**
 * Ctrl+C ya process band hone par connections safely close karta hai.
 */
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await mongoose.connection.close();
  console.log('Server and MongoDB connection closed.');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  shutdown('unhandledRejection');
});

startServer();
