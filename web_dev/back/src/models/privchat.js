import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const PrivChat = sequelize.define('PrivChat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id1: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id2: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lastmess:{
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'PrivChat',
  timestamps: false, 
});

PrivChat.belongsTo(User, { as: 'user1', foreignKey: 'id1' });
PrivChat.belongsTo(User, { as: 'user2', foreignKey: 'id2' });

export default PrivChat;
