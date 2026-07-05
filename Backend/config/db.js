const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/talknest";

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || process.env.MONGODB_URI || LOCAL_MONGO_URI;

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (primaryUri !== LOCAL_MONGO_URI) {
      console.warn(`Primary MongoDB URI failed, trying local fallback: ${LOCAL_MONGO_URI}`);

      try {
        const conn = await mongoose.connect(LOCAL_MONGO_URI, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          autoIndex: true,
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
      } catch (localError) {
        console.error(`MongoDB local fallback failed: ${localError.message}`);
        return null;
      }
    }

    console.error(`MongoDB connection failed: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
