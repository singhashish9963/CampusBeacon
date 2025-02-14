import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import dotenv from "dotenv";
dotenv.config("./.env");

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

  // Track active users in channels
  const channelUsers = new Map();

  const getCurrentUtcTime = () => {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  };

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

      socket.channels = new Set();
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

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

      socket.to(roomName).emit("user-joined", {
        userId: socket.user.id,
        username: socket.user.username,
        timestamp: getCurrentUtcTime(),
      });

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
    const { messageId, channelId, timestamp, userId } = data;
    io.to(`channel-${channelId}`).emit("message-deleted", {
      messageId,
      channelId,
      timestamp,
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
