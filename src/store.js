import path from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { UPLOAD_DIR } from './upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');

const demoProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Over-ear headphones with clear sound and 30-hour battery life.',
    price: 89.99,
    stock: 18,
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    description: 'Compact keyboard with tactile switches and white backlight.',
    price: 74.5,
    stock: 12,
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Desk Lamp',
    description: 'Dimmable LED desk lamp with three colour temperatures.',
    price: 39.99,
    stock: 25,
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Laptop Stand',
    description: 'Adjustable aluminium stand for a cleaner and cooler workspace.',
    price: 49,
    stock: 9,
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'USB-C Hub',
    description: 'Seven-port hub with HDMI, USB 3.0 and fast charging.',
    price: 34.75,
    stock: 0,
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Wireless Mouse',
    description: 'Lightweight mouse with silent clicks and a long battery life.',
    price: 24.99,
    stock: 31,
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
];

function readProducts() {
  mkdirSync(DATA_DIR, { recursive: true });

  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify(demoProducts, null, 2));
    return structuredClone(demoProducts);
  }

  try {
    const products = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
}

function writeProducts(products) {
  writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

export function listProducts(search = '') {
  const term = String(search).trim().toLowerCase();
  const products = readProducts();

  return term
    ? products.filter((product) => product.name.toLowerCase().includes(term))
    : products;
}

export function getProduct(id) {
  return readProducts().find((product) => product.id === id) || null;
}

export function createProduct(data) {
  const products = readProducts();
  const nextId = products.reduce((highest, product) => Math.max(highest, product.id), 0) + 1;

  const product = {
    id: nextId,
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock,
    imageUrl: data.imageUrl || '',
    createdAt: new Date().toISOString(),
  };

  products.unshift(product);
  writeProducts(products);
  return product;
}

export function updateProduct(id, data) {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };

  writeProducts(products);
  return products[index];
}

export function deleteProduct(id) {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;

  const [removed] = products.splice(index, 1);
  writeProducts(products);
  return removed;
}

export function deleteImageFile(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;

  const filename = path.basename(imageUrl);
  try {
    unlinkSync(path.join(UPLOAD_DIR, filename));
  } catch {
    // The file may already be gone; nothing else to clean up.
  }
}
