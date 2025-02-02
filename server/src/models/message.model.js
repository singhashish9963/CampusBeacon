import sequelize from "../db/db.js"
import { DataTypes } from "sequelize"
import users from "./user.model.js";
 const message=sequelize.define("message",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    channelId:{
        type:DataTypes.STRING,
        allowNull:false,
        field:'channel_id'
    },
    registration_number:{
        type:DataTypes.STRING,
        allowNull:false
    },
    messages:{
        type:DataTypes.TEXT,
        allowNull:false
    }
},{
    timestamps:true
})
users.hasMany(message);
message.belongsTo(users);

export default message;