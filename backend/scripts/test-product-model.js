import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import Product from '../src/models/Product.js';

const run = async () => {
  await connectDB();

  // Clean test collection
  await Product.deleteMany({});

  // Create
  const created = await Product.create({
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 1299,
    category: 'Electronics',
    stock: 25,
    images: [{ url: '/uploads/mouse.jpg', filename: 'mouse.jpg' }],
  });
  console.log('Created:', created._id, created.name, created.createdAt);

  // Read all
  const all = await Product.find().sort({ createdAt: -1 });
  console.log('All count:', all.length);

  // Read one
  const one = await Product.findById(created._id);
  console.log('Found:', one.name, one.price);

  // Update
  one.price = 1199;
  one.stock = 20;
  await one.save();
  console.log('Updated price:', one.price, 'stock:', one.stock, 'updatedAt:', one.updatedAt);

  // Search + filter + pagination
  await Product.create({ name: 'USB Cable', description: 'Type-C', price: 299, category: 'Electronics', stock: 50 });
  await Product.create({ name: 'Notebook', description: 'A5 ruled', price: 120, category: 'Stationery', stock: 100 });

  const search = await Product.find({ name: { $regex: 'usb', $options: 'i' } });
  console.log('Search "usb":', search.map((p) => p.name));

  const filtered = await Product.find({ category: 'Electronics' });
  console.log('Electronics:', filtered.length);

  const page = await Product.find().sort({ createdAt: -1 }).skip(0).limit(2);
  console.log('Page 1 (limit 2):', page.map((p) => p.name));

  // Delete
  await Product.deleteOne({ _id: created._id });
  console.log('Remaining after delete:', await Product.countDocuments());

  await mongoose.connection.close();
  console.log('Done.');
};

run().catch((err) => {
  console.error('TEST FAILED:', err.message);
  process.exit(1);
});
