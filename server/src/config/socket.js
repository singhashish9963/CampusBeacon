import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import redis from "./redis.js";

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Connection handling
  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.id);

    // Store user's socket ID in Redis
    redis.set(`user:${socket.user.id}:socket`, socket.id);

    // Join user's channels
    socket.on("channel:join", async (channelId) => {
      socket.join(channelId);
      // Store channel membership in Redis
      await redis.sadd(`channel:${channelId}:members`, socket.user.id);
    });

    // Leave channel
    socket.on("channel:leave", async (channelId) => {
      socket.leave(channelId);
      // Remove channel membership from Redis
      await redis.srem(`channel:${channelId}:members`, socket.user.id);
    });

    // Send message
    socket.on("message:send", async (data) => {
      const { channelId, content } = data;
      try {
        // Emit to channel
        io.to(channelId).emit("message:received", {
          content,
          channelId,
          userId: socket.user.id,
          timestamp: new Date(),
        });

        // Store message in Redis for caching
        await redis.lpush(
          `channel:${channelId}:messages`,
          JSON.stringify({
            content,
            userId: socket.user.id,
            timestamp: new Date(),
          })
        );

        // Keep only last 100 messages in Redis
        await redis.ltrim(`channel:${channelId}:messages`, 0, 99);
      } catch (error) {
        socket.emit("message:error", error.message);
      }
    });

    // Typing indicator
    socket.on("typing:start", (channelId) => {
      socket.to(channelId).emit("typing:started", {
        userId: socket.user.id,
        channelId,
      });
    });

    socket.on("typing:stop", (channelId) => {
      socket.to(channelId).emit("typing:stopped", {
        userId: socket.user.id,
        channelId,
      });
    });

    // Disconnection handling
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.user.id);
      // Remove user's socket ID from Redis
      await redis.del(`user:${socket.user.id}:socket`);
    });
  });

  return io;
};

export default setupSocket;
