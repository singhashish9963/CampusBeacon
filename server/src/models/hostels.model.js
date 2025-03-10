import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

/*
=============================
        Hostel Model
=============================
*/
const Hostel = sequelize.define(
  "Hostel",
  {
    hostel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hostel_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    tableName: "hostels",
  }
);

/*
=============================
        Menu Model
=============================
*/
const Menu = sequelize.define(
  "Menu",
  {
    menu_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hostel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Hostel,
        key: "hostel_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    day: {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      allowNull: false,
    },
    breakfast: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lunch: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    snacks: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dinner: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "menus",
  }
);

/*
=============================
       Official Model
=============================
*/
const Official = sequelize.define(
  "Official",
  {
    official_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hostel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Hostel,
        key: "hostel_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isNumeric: true,
        len(value) {
          const stringValue = String(value);
          if (stringValue.length < 10 || stringValue.length > 12) {
            throw new Error(
              "Phone number length must be between 10 and 12 digits."
            );
          }
        },
      },
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "officials",
  }
);

/*
=============================
       Complaint Model
=============================
*/
const Complaint = sequelize.define(
  "Complaint",
  {
    complaint_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hostel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Hostel,
        key: "hostel_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    official_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Official,
        key: "official_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    official_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    official_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    complaint_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complaint_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterToday(value) {
          const today = new Date();
          // Reset time to midnight
          today.setHours(0, 0, 0, 0);
          const dueDate = new Date(value);
          if (dueDate <= today) {
            throw new Error("Due date must be after today");
          }
        },
      },
    },
  },
  {
    timestamps: true,
    tableName: "complaints",
  }
);

/*
=============================
       Notification Model
=============================
*/
const Notification = sequelize.define(
  "Notification",
  {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hostel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Hostel,
        key: "hostel_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: "notifications",
  }
);

export { Hostel, Menu, Official, Complaint, Notification };
