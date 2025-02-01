

import { Server } from "socket.io";
import ChatController from "./chatController.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const chatController = new ChatController(io);

  io.on("connection", (socket) => {
    chatController.initialize(socket);
  });

  return io;
};
