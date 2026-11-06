// ============================================================
// PHASE 1 - PRACTICE 1
// Basic HTTP server without Express (pure Node.js)
// Run: node practice/phase-1-node-basics/01-http-server.js
// ============================================================

import http from 'node:http';

// createServer ek request handler function leta hai.
// Har incoming request ke liye ye function chalega.
const server = http.createServer((req, res) => {
  // req = jo client ne bheja (URL, method, headers, body)
  // res = jo hum client ko wapas bhejenge

  console.log(`${req.method} ${req.url}`);

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to Products Admin practice server!');
  } else if (req.url === '/api/health') {
    // JSON response bhejna ho to Content-Type application/json set karo
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Server is alive' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Route not found' }));
  }
});

const port = 3001;
server.listen(port, () => {
  console.log(`Practice HTTP server running at http://localhost:${port}`);
  console.log('Try: / and /api/health and /unknown');
});

// Note: Express ke baad ye same kaam 2-3 lines me ho jata hai.
// Node ka http module low-level hai; Express iska wrapper hai.
