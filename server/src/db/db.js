import {Sequelize} from 'sequelize';
import asyncHandler from '../utils/asyncHandler.js';
import dotenv from "dotenv"
dotenv.config();

/*
=============================================================
        Db variables (.env not working fix later)  
=============================================================
*/
const DB_NAME =  "CampusBeacon";
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;

/*
=======================================================
        Sequelize Instance to be used by models  
=======================================================
*/

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "localhost",
    dialect: 'postgres',
    port:process.env.DB_PORT,
});

/*
==================================================================
        Database and model had some different fields :(
==================================================================
*/

sequelize
  .sync()
  .then(() => {
    console.log("Database & tables have been updated!");
  })
  .catch((error) => {
    console.error("Error updating database schema:", error);
  });

/*
===========================================================
        Async Handler wraps everything in promise   
===========================================================
*/
export const connectDb = asyncHandler(async () => {
        await sequelize.authenticate();
        console.log('Database Connection has been established successfully.');
   
});

export default sequelize;
