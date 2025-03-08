import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

// Define Branch model
const Branch = sequelize.define(
  "Branch",
  {
    branch_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    branch_name: {
      type: DataTypes.ENUM(
        "Biotechnology",
        "Chemical Engineering",
        "Civil Engineering",
        "Computer Science and Engineering",
        "Electrical Engineering",
        "Electronics and Communication Engineering",
        "Materials Engineering",
        "Mechanical Engineering",
        "Production and Industrial Engineering",
        "Engineering and Computational Mechanics"
      ),
      allowNull: false,
      // Removed inline unique: true to avoid PostgreSQL migration issues
    },
  },
  {
    timestamps: true,
    tableName: "branches",
    indexes: [
      {
        unique: true,
        fields: ["branch_name"],
      },
    ],
  }
);

// Define Year model
const Year = sequelize.define(
  "Year",
  {
    year_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    year_name: {
      type: DataTypes.ENUM(
        "First Year",
        "Second Year",
        "Third Year",
        "Fourth Year"
      ),
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "branches",
        key: "branch_id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    tableName: "years",
  }
);

// Define StudyMaterial model
const StudyMaterial = sequelize.define(
  "StudyMaterial",
  {
    material_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    material_type: {
      type: DataTypes.ENUM("Video", "PDF"),
      allowNull: false,
    },
    material_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "branches",
        key: "branch_id",
      },
      onDelete: "CASCADE",
    },
    year_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "years",
        key: "year_id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    tableName: "study_materials",
  }
);

export { StudyMaterial, Year, Branch };
