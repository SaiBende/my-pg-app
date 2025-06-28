import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    console.log("✅ Using cached DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connection established");
        return mongoose.connection;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  } else {
    console.log("⏳ Awaiting existing MongoDB connection promise...");
  }

  try {
    cached.conn = await cached.promise;
    console.log("📦 DB Connection ReadyState:", cached.conn.readyState); // 1 = connected
  } catch (error) {
    console.error("❌ Error awaiting DB connection:", error);
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
