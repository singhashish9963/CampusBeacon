import User from "./user.model.js"
import LostAndFound from "./lostandfound.model.js";
import BuyAndSell from "./buyandsell.model.js";
User.hasMany(LostAndFound, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

LostAndFound.belongsTo(User, {
  foreignKey: "userId",
});

BuyAndSell.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

User.hasMany(BuyAndSell, {
  foreignKey: "userId",
});


export { User, LostAndFound,BuyAndSell };
