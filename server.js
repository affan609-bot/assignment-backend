import app from './src/app.js';

const port = Number(process.env.PORT) || 4000;

const server = app.listen(port, () => {
  console.log('');
  console.log('  Products API + Admin Panel');
  console.log('  --------------------------');
  console.log(`  Admin    http://localhost:${port}`);
  console.log(`  List     GET  http://localhost:${port}/api/products`);
  console.log(`  Upload   POST http://localhost:${port}/api/uploads`);
  console.log(`  Health   http://localhost:${port}/api/health`);
  console.log('');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Set PORT to a free port and try again.`);
    process.exit(1);
  }
  throw error;
});
