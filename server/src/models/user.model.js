import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const users = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    registration_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        index:true,
    },
    semester: {
        type: DataTypes.ENUM,
        values: [
            "First",
            "Second",
            "Third",
            "Fourth",
            "Fifth",
            "Sixth",
            "Seventh",
            "Eighth",
        ],
        allowNull: false,
    },
    branch: {
        type: DataTypes.ENUM,
        values: [
            "Electronics and Communication Engineering",
            "Computer Science Engineering",
            "Electrical Engineering",
            "Mechanical Engineering",
            "Civil Engineering",
            "Engineering and Computational Mechanics",
            "Chemical Engineering",
            "Material Engineering",
            "Production and Industrial Engineering",
            "Biotechnology",
        ],
        allowNull: false,
    },
    hostel: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    graduation_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
   
},{
    timestamps:true,
    indexes:[
        {
            unique:true,
            fields:['registration_number']
        },
    ]
}
);

export default users;
