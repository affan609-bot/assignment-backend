import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Cached MongoDB connection (important for serverless/Vercel).
 * Reuses an existing connection instead of opening a new one per request.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI (or MONGODB_URI) is missing. Add it to backend/.env or Vercel env.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        bufferCommands: false,
      })
      .then((conn) => {
        console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
    cached.conn = null;
    cached.promise = null;
  });

  return cached.conn;
};

export default connectDB;
