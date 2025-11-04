const sequelize = require('../config/database');

const UserModel = require('./User');
const ItemModel = require('./Item');
const MatchModel = require('./Match');
const LogModel = require('./Log');

const User = UserModel(sequelize);
const Item = ItemModel(sequelize);
const Match = MatchModel(sequelize);
const Log = LogModel(sequelize);

User.hasMany(Item, { foreignKey: 'created_by', as: 'items' });
Item.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Match, { foreignKey: 'verified_by', as: 'verifiedMatches' });
Match.belongsTo(User, { foreignKey: 'verified_by', as: 'verifier' });

Item.hasMany(Match, { foreignKey: 'lost_item_id', as: 'lostMatches' });
Item.hasMany(Match, { foreignKey: 'found_item_id', as: 'foundMatches' });
Match.belongsTo(Item, { foreignKey: 'lost_item_id', as: 'lostItem' });
Match.belongsTo(Item, { foreignKey: 'found_item_id', as: 'foundItem' });

User.hasMany(Log, { foreignKey: 'user_id', as: 'logs' });
Log.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Item,
  Match,
  Log
};