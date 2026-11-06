import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import Admin from '../src/models/Admin.js';

const run = async () => {
  await connectDB();

  const name = process.env.ADMIN_NAME || 'Store Admin';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    await mongoose.connection.close();
    return;
  }

  const admin = await Admin.create({ name, email, password });
  console.log('Admin created:', admin.email);
  await mongoose.connection.close();
};

run().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
