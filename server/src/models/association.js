import sequelize from "../db/db.js";
import User from "./user.model.js";
import BuyAndSell from "./buyandsell.model.js";
import LostAndFound from "./lostandfound.model.js";
import Channel from "./channel.model.js";
import Message from "./message.model.js";
import UserSubjects from "./userSubjects.model.js";
import { Subject } from "./subject.model.js";
import { UserAttendance, AttendanceStats } from "./attendance.model.js";
import { Menu } from "./hostels.model.js";
import { Hostel } from "./hostels.model.js";
import { Official } from "./hostels.model.js";
import {Complaint} from './hostels.model.js';
import {Notification} from "./hostels.model.js";
import {Branch, Year, StudyMaterial} from "./resources.model.js";
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

  Hostel.hasMany(Menu, { foreignKey: "hostel_id", onDelete: "CASCADE" });
  Menu.belongsTo(Hostel, { foreignKey: "hostel_id" });
  
  Hostel.hasMany(Official, { foreignKey: "hostel_id" });
  Official.belongsTo(Hostel, { foreignKey: "hostel_id" });
  
  Hostel.hasMany(Complaint, { foreignKey: "hostel_id" });
  Complaint.belongsTo(Hostel, { foreignKey: "hostel_id" });
  
  Official.hasMany(Complaint, { foreignKey: "official_id" });
  Complaint.belongsTo(Official, { foreignKey: "official_id" });
  
  Hostel.hasMany(Notification, { foreignKey: "hostel_id" });
  Notification.belongsTo(Hostel, { foreignKey: "hostel_id" });
  

  Branch.hasMany(Year, { foreignKey: "branch_id", onDelete: "CASCADE" });
Year.belongsTo(Branch, { foreignKey: "branch_id" });

Year.hasMany(StudyMaterial, { foreignKey: "year_id", onDelete: "CASCADE" });
Branch.hasMany(StudyMaterial, { foreignKey: "branch_id", onDelete: "CASCADE" });

StudyMaterial.belongsTo(Branch, { foreignKey: "branch_id" });
StudyMaterial.belongsTo(Year, { foreignKey: "year_id" });

};
// User - Rides associations
User.hasMany(Rides, {
  foreignKey: "creatorId",
  as: "rides",
  onDelete: "CASCADE",
});

Rides.belongsTo(User, {
  foreignKey: "creatorId",
  as: "creator",
});

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
