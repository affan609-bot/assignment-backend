import mongoose from 'mongoose';

/**
 * MongoDB connect karta hai.
 * Server sirf tab start hoga jab ye function successfully complete ho.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env');
  }

  mongoose.set('strictQuery', true);

  // 10 second tak try karega, phir clear error dega.
  const connection = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(
    `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
  );

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
  });

  return connection;
};

export default connectDB;
