import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const Connect = sequelize.define('Connect', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
}, {
  tableName: 'connect_co',
  timestamps: false,
});

User.hasMany(Connect, { foreignKey: 'userId', oneDelete: 'CASCADE' });
Connect.belongsTo(User, { foreignKey: 'userId' });

export default Connect;