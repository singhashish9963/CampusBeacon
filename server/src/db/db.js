import { Sequelize } from "sequelize";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();

// Database Configuration
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST.replace(/^.*@/, ''); 

const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
const DB_SSL = process.env.DB_SSL === "true";

// Sequelize Instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  port: DB_PORT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Sync Models
sequelize
  .sync({alter:true})
  .then(() => {
    console.log("Database & tables have been updated!");
  })
  .catch((error) => {
    console.error("Error updating database schema:", error);
  });

// Connect to Database
export const connectDb = asyncHandler(async () => {
  await sequelize.authenticate();
  console.log("Database Connection has been established successfully.");
});

export default sequelize;
