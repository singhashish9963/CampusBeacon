import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";
import Subject from "./subject.model.js";

// User Attendance Model
export const UserAttendance = sequelize.define(
  "user_attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Excused", "Late"),
      allowNull: false,
      defaultValue: "Present",
    },
  },
  {
    timestamps: true,
    tableName: "user_attendance",
    indexes: [
      // Add a unique index to prevent duplicate entries
      {
        unique: true,
        fields: ["user_id", "subject_id", "date"],
        name: "unique_attendance_entry",
      },
    ],
  }
);

// Attendance Statistics Model
export const AttendanceStats = sequelize.define(
  "attendance_stats",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    total_classes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_present: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: "attendance_stats",
    indexes: [
      {
        unique: true,
        fields: ["user_id", "subject_id"],
        name: "unique_user_subject_stats",
      },
    ],
  }
);

export default { UserAttendance, AttendanceStats };
