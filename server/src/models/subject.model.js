import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

export const Subject = sequelize.define(
  "subjects",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    credit:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: "📚",
    },
  },
  {
    timestamps: true,
    tableName: "subjects",
  }
);

export default Subject;
