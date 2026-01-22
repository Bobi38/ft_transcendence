import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const chatG = sequelize.define('chat', {
  contenu: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'chat_G',
  timestamps: false, // désactive createdAt / updatedAt si tu n’en veux pas
});



export default chatG;
