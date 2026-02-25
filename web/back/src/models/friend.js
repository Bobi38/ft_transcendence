import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const Friend = sequelize.define('friend', {
  Friend1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  Friend2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  State: {
    type: DataTypes.BOOLEEN,
    defaultValue: false,
  },
  WhoAsk: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'friend',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['Friend1', 'Friend2']
    }
  ]
});

User.belongsToMany(User, {through: Friend,as: 'Friends',foreignKey: 'Friend1',otherKey: 'Friend2'});
User.belongsToMany(User, {through: Friend,as: 'FriendOf',foreignKey: 'Friend2',otherKey: 'Friend1'});
Friend.belongsTo(User, { as: 'Requester', foreignKey: 'WhoAsk' });

export default Friend;