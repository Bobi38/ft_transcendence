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
  Log42: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  mail: {
    type: DataTypes.STRING(256),
    allowNull: false,
    unique: true,
  },
  adress: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  OAuth: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  
  },
  co:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  password_2FA: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  password_2FA_time: {
    type: DataTypes.TIME,
    allowNull: true,
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
