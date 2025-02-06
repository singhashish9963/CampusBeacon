// config/socket.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import dotenv from "dotenv"
dotenv.config()

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

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

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    socket.on("join-channel", (channelId) => {
      socket.join(`channel-${channelId}`);
      console.log(`${socket.user.id} joined channel ${channelId}`);

      socket.to(`channel-${channelId}`).emit("user-joined", {
        userId: socket.user.id,
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      });
    });

    socket.on("leave-channel", (channelId) => {
      socket.leave(`channel-${channelId}`);
      console.log(`${socket.user.id} left channel ${channelId}`);

      socket.to(`channel-${channelId}`).emit("user-left", {
        userId: socket.user.id,
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      });
    });

    socket.on("typing-start", (channelId) => {
      socket.to(`channel-${channelId}`).emit("user-typing", {
        userId: socket.user.id,
      });
    });

    socket.on("typing-stop", (channelId) => {
      socket.to(`channel-${channelId}`).emit("user-stop-typing", {
        userId: socket.user.id,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

export default initializeSocket;
