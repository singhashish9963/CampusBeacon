import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import User from "./user.model.js";
import Subject from "./subject.model.js";

const UserAttendance = sequelize.define(
  "user_attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "subject_id",
      references: {
        model: "subjects",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Cancelled"),
      allowNull: false,
    },
  },
  {
    tableName: "user_attendance",
    timestamps: true,
    underscored: true,
  }
);

const AttendanceStats = sequelize.define(
  "attendance_stats",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "subject_id",
      references: {
        model: "subjects",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    totalClasses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "total_classes",
    },
    totalPresent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "total_present",
    },
  },
  {
    tableName: "attendance_stats",
    timestamps: true,
    underscored: true,
  }
);

// Define relationships
User.hasMany(UserAttendance, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
UserAttendance.belongsTo(User, {
  foreignKey: "user_id",
});

Subject.hasMany(UserAttendance, {
  foreignKey: "subject_id",
  onDelete: "CASCADE",
});
UserAttendance.belongsTo(Subject, {
  foreignKey: "subject_id",
});

User.hasMany(AttendanceStats, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
AttendanceStats.belongsTo(User, {
  foreignKey: "user_id",
});

Subject.hasMany(AttendanceStats, {
  foreignKey: "subject_id",
  onDelete: "CASCADE",
});
AttendanceStats.belongsTo(Subject, {
  foreignKey: "subject_id",
});

export { UserAttendance, AttendanceStats };
