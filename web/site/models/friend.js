import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const Friend = sequelize.define('friend', {
}, {
  tableName: 'friend',
  timestamps: false, // désactive createdAt / updatedAt si tu n’en veux pas
});

User.hasMany(Friend, { foreignKey: 'Friend1', onDelete: 'CASCADE', as: 'FriendF' });
Friend.belongsTo(User, { foreignKey: 'Friend1', as: 'User1'});
User.hasMany(Friend, { foreignKey: 'Friend2', onDelete: 'CASCADE', as: 'FriendS' });
Friend.belongsTo(User, { foreignKey: 'Friend2', as: 'User2' });

export default Friend;