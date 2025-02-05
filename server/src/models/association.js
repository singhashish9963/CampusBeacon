import User from "./user.model.js";
import BuyAndSell from "./buyandsell.model.js";
import LostAndFound from "./lostandfound.model.js";

User.hasMany(LostAndFound, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
LostAndFound.belongsTo(User, { foreignKey: "userId" });

User.hasMany(BuyAndSell, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BuyAndSell.belongsTo(User, { foreignKey: "userId", as: "users" });

export { User, LostAndFound, BuyAndSell };
