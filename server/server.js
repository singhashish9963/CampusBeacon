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
import subjectRoutes from "./src/routes/subject.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import userSubjectsRoutes from "./src/routes/userSubject.routes.js";
import eateriesRoutes from "./src/routes/eateries.routes.js";
import hostelsRoutes from "./src/routes/hostel.routes.js"
import session from "express-session";
import scheduleUnverifiedUserCleanup from "./src/utils/killUnverifiedUser.js";
import ridesRoutes from "./src/routes/ride.routes.js"
import resourcesRoutes from "./src/routes/resources.routes.js"
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
scheduleUnverifiedUserCleanup();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-temporary-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    name: "sessionId",
  })
);

// Socket.io setup - AFTER session middleware
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
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/hostels",hostelsRoutes);
app.use("/api/rides",ridesRoutes);
app.use("/api/v1/user-subjects", userSubjectsRoutes);
app.use("/eateries", eateriesRoutes);
app.use("/api/resources", resourcesRoutes);

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
