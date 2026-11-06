// ============================================================
// PHASE 1 - PRACTICE 2
// File System (fs) module - read, write, append
// Run: node practice/phase-1-node-basics/02-fs-read-write.js
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoFile = path.join(__dirname, 'demo.txt');

// ---------- 1. Synchronous (blocking) write ----------
// Program yahan rukega jab tak file write na ho.
fs.writeFileSync(demoFile, 'Hello from sync write!\n');
console.log('1) Sync write done');

// ---------- 2. Asynchronous (non-blocking) append ----------
// Callback chalega jab operation complete hoga.
fs.appendFile(demoFile, 'Line added async!\n', (err) => {
  if (err) {
    console.error('Append error:', err.message);
    return;
  }
  console.log('2) Async append done');
});

// ---------- 3. Read file ----------
fs.readFile(demoFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Read error:', err.message);
    return;
  }
  console.log('3) File content:\n' + data);
});

// ---------- 4. Promise-based fs (modern) ----------
import { readFile, writeFile } from 'node:fs/promises';

await writeFile(demoFile, 'Overwritten by promise-based write!\n');
const content = await readFile(demoFile, 'utf8');
console.log('4) Promise read:', content.trim());

// ---------- 5. Check if file exists ----------
console.log('5) Exists?', fs.existsSync(demoFile));

// ---------- 6. Delete file ----------
fs.unlinkSync(demoFile);
console.log('6) File deleted. Exists now?', fs.existsSync(demoFile));

// Key point:
// Sync methods blocking hain (request handle karte time avoid karo).
// Async/Promise methods preferred hain production me.
