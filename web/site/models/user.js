import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  mail: {
    type: DataTypes.STRING(256),
    allowNull: false,
    unique: true,
  },
  co:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  win: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_part: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'user_co',
  timestamps: false, // désactive createdAt / updatedAt si tu n’en veux pas
});



export default User;
