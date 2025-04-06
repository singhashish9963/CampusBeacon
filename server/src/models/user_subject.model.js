// models/user_subject.js
import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const UserSubject = sequelize.define(
  "user_subject", 
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", 
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", 
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "subjects", 
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", 
    },

  },
  {
    timestamps: true, 
    tableName: "user_subjects",
    indexes: [

      {
        unique: true,
        fields: ["userId", "subjectId"],
        name: "user_subject_unique_enrollment",
      },
    ],
  }
);

export default UserSubject;
