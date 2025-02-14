import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import User from "../models/user.model.js";

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
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
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

Subject.belongsToMany(User, {
  through: "user_subjects",
  foreignKey: "subjectId",
  onDelete: "CASCADE",
});

User.belongsToMany(Subject, {
  through: "user_subjects",
  foreignKey: "userId",
  onDelete: "CASCADE",
});

export default Subject;
