import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createServer } from "http";
import scheduleUnverifiedUserCleanup from "./src/utils/killUnverifiedUser.js";
import { initializeAssociations } from "./src/models/association.js";

// Import routes
import userRoutes from "./src/routes/user.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import lostAndFoundRoutes from "./src/routes/lostandfound.routes.js";
import buyAndSellRoutes from "./src/routes/buyandsell.routes.js";
import subjectRoutes from "./src/routes/subject.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import userSubjectsRoutes from "./src/routes/userSubject.routes.js";
import eateriesRoutes from "./src/routes/eateries.routes.js";
import hostelsRoutes from "./src/routes/hostel.routes.js";
import ridesRoutes from "./src/routes/ride.routes.js";
import resourcesRoutes from "./src/routes/resources.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import chatBotRoutes from "./src/routes/chatBot.routes.js";

dotenv.config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://campus-beacon.vercel.app",
    "https://campusbeacon.onrender.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-session-id"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Fallback CORS headers for extra protection
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    req.headers.origin || "https://campus-beacon.vercel.app"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-session-id"
  );

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    },
    name: "sessionId",
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/lost-and-found", lostAndFoundRoutes);
app.use("/api/buy-and-sell", buyAndSellRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/hostels", hostelsRoutes);
app.use("/api/rides", ridesRoutes);
app.use("/api/v1/user-subjects", userSubjectsRoutes);
app.use("/api/eateries", eateriesRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/chatbot", chatBotRoutes);

import { connectDb } from "./src/db/db.js";

const startServer = async () => {
  try {
    console.log("Connecting to database...");
    await connectDb();
    console.log("Database connected successfully");

    const httpServer = createServer(app);

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

initializeAssociations();

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

startServer();
