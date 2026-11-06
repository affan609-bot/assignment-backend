import { readFileSync } from 'node:fs';
import { Blob } from 'node:buffer';

const base = 'http://localhost:5000';
const png = readFileSync('C:/Users/Administrator/AppData/Local/Temp/opencode/test.png');

// Login
const loginRes = await fetch(`${base}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@example.com', password: 'Admin@12345' }),
});
const login = await loginRes.json();
const token = login.token;
console.log('login:', login.message);

// Single upload
const form1 = new FormData();
form1.append('image', new Blob([png], { type: 'image/png' }), 'test.png');
const singleRes = await fetch(`${base}/api/uploads/single`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: form1,
});
const single = await singleRes.json();
console.log('single upload:', singleRes.status, single.data?.filename);

// Multiple upload
const form2 = new FormData();
form2.append('images', new Blob([png], { type: 'image/png' }), 'a.png');
form2.append('images', new Blob([png], { type: 'image/png' }), 'b.png');
const multiRes = await fetch(`${base}/api/uploads/multiple`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: form2,
});
const multi = await multiRes.json();
console.log('multiple upload:', multiRes.status, multi.count);

// List
const listRes = await fetch(`${base}/api/uploads`);
const list = await listRes.json();
console.log('list total:', list.total);

// Create product then upload image to it
const prodRes = await fetch(`${base}/api/products`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ name: 'Test Product', price: 100, category: 'Test', stock: 5 }),
});
const prod = await prodRes.json();
const pid = prod.data._id;
console.log('product created:', pid);

const form3 = new FormData();
form3.append('images', new Blob([png], { type: 'image/png' }), 'p.png');
const imgRes = await fetch(`${base}/api/products/${pid}/images`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: form3,
});
const img = await imgRes.json();
console.log('product image upload:', imgRes.status, img.data?.images?.length);

// Delete product (should delete image file)
const delRes = await fetch(`${base}/api/products/${pid}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
});
console.log('product delete:', delRes.status, (await delRes.json()).message);

// Delete standalone upload
const upId = single.data._id;
const delUpRes = await fetch(`${base}/api/uploads/${upId}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
});
console.log('upload delete:', delUpRes.status, (await delUpRes.json()).message);

// Invalid file type test
const formBad = new FormData();
formBad.append('image', new Blob([png], { type: 'image/png' }), 'bad.exe');
// rename extension by using a Blob with .exe name
const formBad2 = new FormData();
const badBlob = new Blob([png], { type: 'image/png' });
// multer checks extension from originalname; use a File-like via Blob with name not possible; append with filename
formBad2.append('image', badBlob, 'bad.exe');
const badRes = await fetch(`${base}/api/uploads/single`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formBad2,
});
console.log('invalid ext upload:', badRes.status, (await badRes.json()).message);
