import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const chatG = sequelize.define('chat', {

  contenu: {
    type: DataTypes.STRING(512),
    Allownull: false,
  },
}, {
  tableName: 'chat_G',
  timestamps: false, // désactive createdAt / updatedAt si tu n’en veux pas
});

User.hasMany(chatG, { foreignKey: 'SenderId', onDelete: 'CASCADE' });
chatG.belongsTo(User, { foreignKey: 'SenderId' });

export default chatG;
