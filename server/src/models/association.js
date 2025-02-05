import User from "./user.model.js";
import BuyAndSell from "./buyandsell.model.js";
import LostAndFound from "./lostandfound.model.js";
import Channel from "./channel.model.js";
import Message from "./message.model.js";

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

Channel.hasMany(Message, {
  foreignKey: "channelId",
  onDelete: "CASCADE",
});

Message.belongsTo(Channel, {
  foreignKey: "channelId",
});


User.hasMany(Message, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Message.belongsTo(User, {
  foreignKey: "userId",
});

export { User, LostAndFound, BuyAndSell, Channel, Message };
