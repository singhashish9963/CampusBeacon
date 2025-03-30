import { Sequelize } from "sequelize";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();

// Database Configuration
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_SSL } = process.env;

// Sequelize Instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  port: Number(DB_PORT) || 6453,
  dialectOptions: {
    ssl:
      DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Database & tables have been updated!");
  })
  .catch((error) => {
    console.error("Error updating database schema:", error);
  });

// Connect to Database
export const connectDb = asyncHandler(async () => {
  await sequelize.authenticate();
  console.log("Database connection has been established successfully.");
});

export default sequelize;
