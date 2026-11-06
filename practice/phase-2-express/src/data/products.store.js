// In-memory store: server band hote hi data khali ho jayega.
// Ye sirf learning ke liye hai — real app me MongoDB use hoga.
let products = [
  {
    id: 1,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 1299,
    category: 'Electronics',
    stock: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Notebook',
    description: 'A5 ruled notebook',
    price: 120,
    category: 'Stationery',
    stock: 100,
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

export const productStore = {
  all() {
    return products;
  },

  findById(id) {
    return products.find((p) => p.id === id);
  },

  create(data) {
    const product = {
      id: nextId++,
      ...data,
      createdAt: new Date().toISOString(),
    };
    products.push(product);
    return product;
  },

  update(id, data) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, id };
    return products[index];
  },

  remove(id) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },

  reset() {
    products = [];
    nextId = 1;
  },
};
