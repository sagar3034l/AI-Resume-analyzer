import mongoose from "mongoose";
import dotenv from 'dotenv';
import dns from 'node:dns';

dotenv.config();

// Some networks/ISPs block SRV DNS queries used by mongodb+srv.
// Force public resolvers so Atlas SRV records resolve consistently.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try { 
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
