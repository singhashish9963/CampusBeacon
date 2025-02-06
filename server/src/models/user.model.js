import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

/*
=============================
        User Model  
=============================
*/

const users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registration_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: true,
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
      allowNull: true,
    },
    hostel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    graduation_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default users;
