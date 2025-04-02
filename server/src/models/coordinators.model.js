import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

export const Coordinator = sequelize.define(
  "coordinators",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    contact: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    social_media_links: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    club_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clubs",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);
