import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log('');
  console.log('  Products Admin API');
  console.log(`  URL     http://localhost:${port}`);
  console.log(`  Health  http://localhost:${port}/api/health`);
  console.log('');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Change PORT in backend/.env.`);
    process.exit(1);
  }

  throw error;
});
