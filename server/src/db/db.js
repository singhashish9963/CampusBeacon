import {Sequelize} from 'sequelize';
import asyncHandler from '../utils/asyncHandler.js';


const DB_NAME = process.env.DB_NAME || "CampusBeacon";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "superman";
const DB_HOST = process.env.DB_HOST 
const DB_PORT = process.env.DB_PORT 

const sequelize=new Sequelize(DB_NAME,DB_USER,DB_PASSWORD,{
    host:DB_HOST,
    dialect:'postgres',
    port:DB_PORT,
});
export const connectDb = asyncHandler(async () => {
        await sequelize.authenticate();
        console.log(' DatabaseConnection has been established successfully.');
   
});

export default sequelize;
