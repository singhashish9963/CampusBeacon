import sequelize from "../db/db.js";
import User from "./user.model.js";
import BuyAndSell from "./buyandsell.model.js";
import LostAndFound from "./lostandfound.model.js";
import UserSubjects from "./userSubjects.model.js";
import { Subject } from "./subject.model.js";
import { UserAttendance, AttendanceStats } from "./attendance.model.js";
import {
  Menu,
  Hostel,
  Official,
  Complaint,
  HostelNotification,
} from "./hostels.model.js";
import { Branch, Year, StudyMaterial } from "./resources.model.js";
import Rides from "./ride.model.js";
import RideParticipant from "./rideParticipant.model.js";
import { Role, UserRole } from "./role.model.js";
import { Message, Channel, ChannelMember } from "./chat.model.js";

export const initializeAssociations = () => {
  // User - Roles associations (many-to-many)
  User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
  Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

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

  // User - Subject associations (many-to-many)
  User.belongsToMany(Subject, { through: UserSubjects });
  Subject.belongsToMany(User, { through: UserSubjects });

  // Attendance associations - FIXED: standardized to user_id and subject_id
  User.hasMany(UserAttendance, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  UserAttendance.belongsTo(User, { foreignKey: "user_id" });
  Subject.hasMany(UserAttendance, {
    foreignKey: "subject_id",
    onDelete: "CASCADE",
  });
  UserAttendance.belongsTo(Subject, { foreignKey: "subject_id" });

  // Attendance Stats associations - FIXED: standardized to user_id and subject_id
  User.hasMany(AttendanceStats, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  AttendanceStats.belongsTo(User, { foreignKey: "user_id" });
  Subject.hasMany(AttendanceStats, {
    foreignKey: "subject_id",
    onDelete: "CASCADE",
  });
  AttendanceStats.belongsTo(Subject, { foreignKey: "subject_id" });

  // Hostel - Menu associations
  Hostel.hasMany(Menu, { foreignKey: "hostel_id", onDelete: "CASCADE" });
  Menu.belongsTo(Hostel, { foreignKey: "hostel_id" });

  // Hostel - Official associations
  Hostel.hasMany(Official, { foreignKey: "hostel_id" });
  Official.belongsTo(Hostel, { foreignKey: "hostel_id" });

  // Hostel - Complaint associations
  Hostel.hasMany(Complaint, { foreignKey: "hostel_id" });
  Complaint.belongsTo(Hostel, { foreignKey: "hostel_id" });

  // Official - Complaint associations
  Official.hasMany(Complaint, { foreignKey: "official_id" });
  Complaint.belongsTo(Official, { foreignKey: "official_id" });

  // Hostel - Notification associations
  Hostel.hasMany(HostelNotification, { foreignKey: "hostel_id" });
  HostelNotification.belongsTo(Hostel, { foreignKey: "hostel_id" });

  // Resources associations
  Branch.hasMany(Year, { foreignKey: "branch_id", onDelete: "CASCADE" });
  Year.belongsTo(Branch, { foreignKey: "branch_id" });
  Year.hasMany(StudyMaterial, { foreignKey: "year_id", onDelete: "CASCADE" });
  Branch.hasMany(StudyMaterial, {
    foreignKey: "branch_id",
    onDelete: "CASCADE",
  });
  StudyMaterial.belongsTo(Branch, { foreignKey: "branch_id" });
  StudyMaterial.belongsTo(Year, { foreignKey: "year_id" });

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
  Rides.hasMany(RideParticipant, { foreignKey: "rideId", as: "participants" });
  RideParticipant.belongsTo(Rides, { foreignKey: "rideId" });

  // Chat associations
  User.hasMany(Message, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Message.belongsTo(User, { foreignKey: "userId" });

  Channel.hasMany(Message, {
    foreignKey: "channelId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Message.belongsTo(Channel, { foreignKey: "channelId" });

  User.belongsToMany(Channel, {
    through: ChannelMember,
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Channel.belongsToMany(User, {
    through: ChannelMember,
    foreignKey: "channelId",
    onDelete: "CASCADE",
  });

  // Channel creator association
  Channel.belongsTo(User, {
    foreignKey: "createdBy",
    as: "creator",
  });
  User.hasMany(Channel, {
    foreignKey: "createdBy",
    as: "createdChannels",
  });
};

export {
  User,
  LostAndFound,
  BuyAndSell,
  UserSubjects,
  Subject,
  UserAttendance,
  AttendanceStats,
  Rides,
  Role,
  UserRole,
  Message,
  Channel,
  ChannelMember,
};
