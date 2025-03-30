import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Rides = sequelize.define(
  "rides",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    dropLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    departureDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      index: true,
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availableSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    estimatedCost: {
      type: DataTypes.FLOAT,
      allowNull: true,
      index: true,
    },
    status: {
      type: DataTypes.ENUM("OPEN", "FULL", "CANCELLED", "COMPLETED"),
      defaultValue: "OPEN",
      allowNull: false,
      index: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["creatorId", "departureDateTime"],
      },
      {
        fields: ["status", "departureDateTime"],
      },
      {
        fields: ["pickupLocation", "dropLocation"],
      },
    ],
  }
);

export default Rides;
