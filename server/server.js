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
import cookieParser from "cookie-parser";
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

/*
===================================
        Cookie to be parsed   
===================================
*/
app.use(cookieParser());

/*
============================================================
        Applying cors for cross origin data exchange 
============================================================
*/
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


const io = initializeSocket(httpServer);


app.use((req, res, next) => {
  req.io = io;
  next();
});

/*
=============================
        Time and Date  
=============================
*/
app.use(express.json());

/*
=============================
        Connect database  
=============================
*/
connectDb();

/*
=======================================
        Testing route for backend  
=======================================
*/
app.get("/", (req, res) => {
  res.send("Hello World!");
});

/*
=========================================
        using routes as middleware   
=========================================
*/
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/lost-and-found", lostAndFoundRoutes);
app.use("/api/buy-and-sell", buyAndSellRoutes);
app.use("/api/chat", ChatRoutes);

/*
=================================
        Starting server :}  
=================================
*/
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
