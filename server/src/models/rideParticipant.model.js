import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import User from "./user.model.js";
import Rides from "./ride.model.js";

const RideParticipant = sequelize.define(
  "RideParticipant",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rideId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rides",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  { timestamps: false }
);

// Define associations for easier joins
RideParticipant.belongsTo(User, { as: "participant", foreignKey: "userId" });
RideParticipant.belongsTo(Rides, { foreignKey: "rideId" });

export default RideParticipant;
