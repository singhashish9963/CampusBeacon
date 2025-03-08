import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import dotenv from "dotenv";

// Configure dotenv with an object for clarity.
dotenv.config({ path: "./.env" });

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: {
      name: "io",
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    },
  });

  // Keep track of active users per channel
  const channelUsers = new Map();

  // Utility to get current UTC time formatted as "YYYY-MM-DD HH:MM:SS"
  const getCurrentUtcTime = () => {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  };

  // Middleware: authenticate socket connection via JWT token in cookies
  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) {
        return next(new Error("Authentication failed - No cookies"));
      }

      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.token;
      if (!token) {
        return next(new Error("Authentication failed - No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = {
        id: decoded?.id,
        username: decoded?.username,
      };

      // Initialize socket properties for tracking channels
      socket.channels = new Set();
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

  // Socket connection
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    socket.on("join-channel", (channelId) => {
      const roomName = `channel-${channelId}`;
      socket.join(roomName);
      socket.channels.add(channelId);

      if (!channelUsers.has(channelId)) {
        channelUsers.set(channelId, new Set());
      }
      channelUsers.get(channelId).add(socket.user.id);

      // Notify others in the room
      socket.to(roomName).emit("user-joined", {
        userId: socket.user.id,
        username: socket.user.username,
        timestamp: getCurrentUtcTime(),
      });

      // Send current channel users to the socket
      socket.emit("channel-users", {
        channelId,
        users: Array.from(channelUsers.get(channelId)),
      });
    });

    socket.on("new-message", (data) => {
      const timestamp = getCurrentUtcTime();
      io.to(`channel-${data.channelId}`).emit("new-message", {
        ...data,
        userId: socket.user.id,
        username: socket.user.username,
        timestamp,
      });
    });

    socket.on("update-message", (data) => {
      const timestamp = getCurrentUtcTime();
      io.to(`channel-${data.channelId}`).emit("message-updated", {
        ...data,
        userId: socket.user.id,
        username: socket.user.username,
        timestamp,
      });
    });

    socket.on("delete-message", (data) => {
      io.to(`channel-${data.channelId}`).emit("message-deleted", {
        messageId: data.messageId,
        channelId: data.channelId,
        timestamp: getCurrentUtcTime(),
        userId: socket.user.id,
      });
    });

    socket.on("typing-start", (channelId) => {
      socket.to(`channel-${channelId}`).emit("user-typing", {
        userId: socket.user.id,
        username: socket.user.username,
      });
    });

    socket.on("typing-stop", (channelId) => {
      socket.to(`channel-${channelId}`).emit("user-stop-typing", {
        userId: socket.user.id,
        username: socket.user.username,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
      // Remove the user from each channel they joined and notify others
      socket.channels.forEach((channelId) => {
        if (channelUsers.has(channelId)) {
          channelUsers.get(channelId).delete(socket.user.id);
          io.to(`channel-${channelId}`).emit("user-left", {
            userId: socket.user.id,
            username: socket.user.username,
            timestamp: getCurrentUtcTime(),
          });
        }
      });
    });
  });

  return io;
};

export default initializeSocket;
