import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import User from "./user.model.js";

const Notification = sequelize.define(
  "notifications",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      // The User model uses an integer id, so we use INTEGER here.
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id", // Explicitly set the database column name to "user_id"
      references: {
        model: "users", // Ensure this matches the table name in the User model
        key: "id",
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "general",
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    entityId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actionUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "notifications",
    indexes: [
      {
        // Define index on the database column name.
        fields: ["user_id"],
      },
      {
        fields: ["is_read"],
      },
    ],
  }
);

// Define associations with User model.
// Using 'userId' (camelCase) in the model, which maps to "user_id" in the database.
Notification.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Notification, { foreignKey: "userId" });

export default Notification;
