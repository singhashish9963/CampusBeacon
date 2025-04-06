import sequelize from "../db/db.js"; // Adjust path if needed
import { DataTypes } from "sequelize";

const AttendanceRecord = sequelize.define(
  "attendance_record",
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent"),
      allowNull: false,
    },
    markedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "attendance_records",
    indexes: [
      {
        unique: true,
        fields: ["userId", "subjectId", "date"],
        name: "user_subject_date_unique_attendance",
      },
      {
        fields: ["userId", "subjectId"],
        name: "attendance_user_subject_idx",
      },
      {
        fields: ["date"],
        name: "attendance_date_idx",
      },
    ],
  }
);

export default AttendanceRecord;
