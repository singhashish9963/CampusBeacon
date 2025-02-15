import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const UserSubjects = sequelize.define(
  "user_subjects",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
    tableName: "user_subjects",
  }
);

export default UserSubjects;
