import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import { PrivChat } from './privchat.js'

const PrivMess = sequelize.define('PrivMess', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idSend: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  conv:{
    type: DataTypes.STRING(512),
    allowNull: false,
  }
}, {
  tableName: 'PrivMess',
  timestamps: false, // désactive createdAt / updatedAt si tu n’en veux pas
});

PrivChat.hasMany(PrivMess, { foreignKey: 'ChatId', onDelete: 'CASCADE' });
PrivMess.belongsTo(PrivChat, { foreignKey: 'ChatId' });

export default PrivMess;