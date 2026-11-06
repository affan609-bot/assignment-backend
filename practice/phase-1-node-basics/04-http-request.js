// ============================================================
// PHASE 1 - PRACTICE 4
// Creating an HTTP request from Node (fetch / https)
// Run: node practice/phase-1-node-basics/04-http-request.js
// ============================================================

// Node 18+ me global fetch available hai (undici based).
const fetchUsers = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=3');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const users = await response.json();
    console.log('Fetched users:');
    for (const user of users) {
      console.log(`- ${user.name} <${user.email}>`);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
};

fetchUsers();

// Older Node versions me 'https' module use hota tha:
// import https from 'node:https';
// https.get('https://...', (res) => { ... });
//
// Aaj kal fetch standard hai, isliye Express/Axios ke baad bhi
// Node ka built-in fetch testing ke liye kaam aata hai.
// Note: Ye external API sirf learning ke liye hai. Final project me
// hum apna backend hi call karenge Axios se.
