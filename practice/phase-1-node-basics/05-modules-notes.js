// ============================================================
// PHASE 1 - PRACTICE 5
// CommonJS vs ES Modules
// ============================================================

// --- CommonJS (default in Node, .js files without "type":"module") ---
// const express = require('express');
// module.exports = { add, subtract };

// --- ES Modules (our project uses this: "type": "module" in package.json) ---
// import express from 'express';
// export function add(a, b) { return a + b; }
// export default add;

// Differences:
// 1. Syntax: require/module.exports vs import/export
// 2. Loading: CommonJS synchronous, ESM asynchronous (top-level await supported)
// 3. this: CommonJS top-level this = module.exports; ESM top-level this = undefined
// 4. File extension: .cjs (CommonJS) / .mjs (ESM) force karte hain
//
// Hamara backend "type": "module" hai, isliye sab files ES modules hain.
// Isliye imports me .js extension likhna padta hai:
//   import app from './app.js';   // <-- .js zaroori
//
// Practice task: neeche diye gaye dono files banao aur run karo.

// --- math.cjs (CommonJS) ---
// function add(a, b) { return a + b; }
// module.exports = { add };

// --- math.mjs (ES Module) ---
// export function add(a, b) { return a + b; }

// --- use-cjs.js ---
// const { add } = require('./math.cjs');
// console.log(add(2, 3));

// --- use-esm.mjs ---
// import { add } from './math.mjs';
// console.log(add(2, 3));
