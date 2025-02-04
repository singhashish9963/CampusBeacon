import User from "./user.model.js"
import LostAndFound from "./lostandfound.model.js";

User.hasMany(LostAndFound, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

LostAndFound.belongsTo(User, {
  foreignKey: "userId",
});

export { User, LostAndFound };
