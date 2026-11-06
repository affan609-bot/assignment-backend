// ============================================================
// PHASE 1 - PRACTICE 3
// Sync vs Async, Event Loop, Call Stack, Queues
// Run: node practice/phase-1-node-basics/03-async-demo.js
// ============================================================

console.log('A) Start');

// setTimeout callback -> Callback Queue (macrotask) me jata hai.
setTimeout(() => {
  console.log('D) setTimeout callback (macrotask)');
}, 0);

// Promise.then -> Microtask Queue me jata hai.
Promise.resolve().then(() => {
  console.log('C) Promise.then (microtask)');
});

// process.nextTick -> sabse high priority microtask (Node-specific).
process.nextTick(() => {
  console.log('B) process.nextTick (microtask, highest priority)');
});

console.log('E) End (synchronous)');

// Expected output order:
// A) Start
// E) End (synchronous)
// B) process.nextTick
// C) Promise.then
// D) setTimeout
//
// Kyun?
// 1. Synchronous code pehle chalta hai (Call Stack).
// 2. Microtasks (nextTick, Promise) macrotasks (setTimeout) se pehle chalti hain.
// 3. nextTick microtasks Promise microtasks se pehle chalti hain.
// 4. setTimeout callback last me chalta hai.
//
// Real-world example:
// User login request aayi -> DB query async hai -> event loop dusre requests handle karta hai
// jab tak DB response nahi aata. Isliye Node single-threaded hone ke bawajood fast hai.
