import {Sequelize} from 'sequelize';


const sequelize=new Sequelize('CampusBeacon','postgres','superman',{
    host:'localhost',
    dialect:'postgres',
    post:'5432',
});
const connectDb = (async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

export default sequelize;
