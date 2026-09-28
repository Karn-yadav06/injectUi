import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  mongoServer?: unknown;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 4000,
    };

    cached.promise = (async () => {
      let uri = process.env.MONGODB_URI;

      if (!uri) {
        // Fallback to mongodb-memory-server in development/test if no external DB provided
        try {
          const { MongoMemoryServer } = await import("mongodb-memory-server");
          if (!cached.mongoServer) {
            cached.mongoServer = await MongoMemoryServer.create();
          }
          const server = cached.mongoServer as InstanceType<typeof MongoMemoryServer>;
          uri = server.getUri();
          console.log("[DB] Using MongoMemoryServer at:", uri);
        } catch (err) {
          console.error("[DB] Failed to initialize MongoMemoryServer:", err);
          throw new Error("MONGODB_URI is not defined and MongoMemoryServer could not be started.");
        }
      }

      let conn: typeof mongoose;
      try {
        conn = await mongoose.connect(uri, opts);
      } catch (err) {
        console.warn("[DB] Failed to connect to MONGODB_URI, falling back to MongoMemoryServer...", err);
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        if (!cached.mongoServer) {
          cached.mongoServer = await MongoMemoryServer.create();
        }
        const server = cached.mongoServer as InstanceType<typeof MongoMemoryServer>;
        const fallbackUri = server.getUri();
        conn = await mongoose.connect(fallbackUri, opts);
      }

      cached.conn = conn;

      if (cached.mongoServer) {
        try {
          const { Component } = await import("@/models/Component");
          const count = await Component.countDocuments();
          if (count === 0) {
            const { seedDatabase } = await import("@/scripts/seed");
            await seedDatabase();
          }
        } catch (seedErr) {
          console.warn("[DB] Auto-seed warning:", seedErr);
        }
      }

      return conn;


    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (cached.mongoServer) {
    const server = cached.mongoServer as { stop: () => Promise<boolean> };
    await server.stop();
    cached.mongoServer = undefined;
  }
  cached.conn = null;
  cached.promise = null;
}
