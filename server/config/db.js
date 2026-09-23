import mongoose from 'mongoose';

/**
 * Connect to MongoDB database instance
 */
export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/petpooja';
    const conn = await mongoose.connect(connStr);
    console.log(`[PetPooja DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[PetPooja DB Error] ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
