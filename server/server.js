import express from "express";
import dotenv from "dotenv";
import sequelize, { connectDb } from "./src/db/db.js";
import userRoutes from "./src/routes/user.routes.js";
import cors from "cors";
import contactRoutes from "./src/routes/contact.routes.js";
import lostAndFoundRoutes from "./src/routes/lostandfound.routes.js";
import buyAndSellRoutes from "./src/routes/buyandsell.routes.js";
import ChatRoutes from "./src/routes/chat.routes.js";
import initializeSocket from "./src/config/socket.js";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import chatBotRoutes from "./src/routes/chatBot.routes.js";


dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Middleware setup
const corsOptions = {
  origin: ["http://localhost:5173", "https://campus-beacon.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Socket.io setup
const io = initializeSocket(httpServer);
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/lost-and-found", lostAndFoundRoutes);
app.use("/api/buy-and-sell", buyAndSellRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/api/chatbot", chatBotRoutes);

// Initialize services and start server
const startServer = async () => {
  try {
    console.log("Connecting to database...");
    await connectDb();
    console.log("Database connected successfully");


    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

startServer();
