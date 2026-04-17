import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const chatG = sequelize.define('chat', {

  contenu: {
    type: DataTypes.TEXT('long'),
    Allownull: false,
  },
  time:{
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  tableName: 'chat_G',
  timestamps: false,
});

User.hasMany(chatG, { foreignKey: 'SenderId', onDelete: 'CASCADE' });
chatG.belongsTo(User, { foreignKey: 'SenderId' });

export default chatG;
