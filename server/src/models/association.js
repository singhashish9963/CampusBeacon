import sequelize from "../db/db.js";
import User from "./user.model.js";
import BuyAndSell from "./buyandsell.model.js";
import LostAndFound from "./lostandfound.model.js";
import Channel from "./channel.model.js";
import Message from "./message.model.js";
import UserSubjects from "./userSubjects.model.js";
import { Subject } from "./subject.model.js";
import { UserAttendance, AttendanceStats } from "./attendance.model.js";
import Rides from "./ride.model.js";

const initializeAssociations = () => {
  // User - LostAndFound associations
  User.hasMany(LostAndFound, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  LostAndFound.belongsTo(User, { foreignKey: "userId" });

  // User - BuyAndSell associations
  User.hasMany(BuyAndSell, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  BuyAndSell.belongsTo(User, { foreignKey: "userId", as: "users" });

  // Channel - Message associations
  Channel.hasMany(Message, {
    foreignKey: "channelId",
    onDelete: "CASCADE",
  });
  Message.belongsTo(Channel, {
    foreignKey: "channelId",
  });

  // User - Message associations
  User.hasMany(Message, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Message.belongsTo(User, {
    foreignKey: "userId",
  });

  // User - Subject associations (many-to-many)
  User.belongsToMany(Subject, { through: UserSubjects });
  Subject.belongsToMany(User, { through: UserSubjects });

  // Attendance associations
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

  // Attendance Stats associations
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

  // User - Ride associations
  User.hasMany(Rides, {
    foreignKey: "creatorId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Rides.belongsTo(User, {
    foreignKey: "creatorId",
    as: "creator",
  });
};

initializeAssociations();

export {
  User,
  LostAndFound,
  BuyAndSell,
  Channel,
  Message,
  UserSubjects,
  Subject,
  UserAttendance,
  AttendanceStats,
  Rides,
};
