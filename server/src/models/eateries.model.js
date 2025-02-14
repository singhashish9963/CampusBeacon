import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Eateries = sequelize.define(
  "eateries",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    openingTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    closingTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    menuImageUrl: {
      type: DataTypes.STRING,
      allowNull: true, // This field will store the Cloudinary image URL
    },
  },
  {
    timestamps: true,
  }
);

export default Eateries;
