import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const PrivChat = sequelize.define('PrivChat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id1: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  id2: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
}, {
  tableName: 'PrivChat',
  timestamps: false, // désactive createdAt / updatedAt si tu n’en veux pas
});



export default PrivChat;
