import app from './app.js';

const port = 4000;
app.listen(port, () => {
  console.log('');
  console.log('  Phase 2 Express Practice Server');
  console.log(`  URL    http://localhost:${port}`);
  console.log(`  Health http://localhost:${port}/api/health`);
  console.log('');
});
