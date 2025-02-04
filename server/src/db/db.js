import {Sequelize} from 'sequelize';
import asyncHandler from '../utils/asyncHandler.js';

/*
=============================================================
        Db variables (.env not working fix later)  
=============================================================
*/
const DB_NAME =  "CampusBeacon";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "superman";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;

/*
=======================================================
        Sequelize Instance to be used by models  
=======================================================
*/

const sequelize = new Sequelize("CampusBeacon", "postgres", "superman", {
    host: "localhost",
    dialect: 'postgres',
    port:5432,
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
