import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

export const EventCoordinator = sequelize.define(
  "event_coordinators",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
    },
    coordinator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "coordinators",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);
