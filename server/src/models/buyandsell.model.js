import { DataTypes } from "sequelize";
import sequelize from "../db/db.js"

const BuyAndSell = sequelize.define("BuyAndSell", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  item_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location_found: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  date_bought: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  owner_contact: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  registration_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: "users",
      key: "registration_number",
    },
    onDelete: "CASCADE",
  },
  item_condition: {
    type: DataTypes.ENUM("Good", "Fair", "Poor"),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default BuyAndSell;
