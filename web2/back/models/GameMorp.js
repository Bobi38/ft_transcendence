import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const GameMorp = sequelize.define('GameMorp', {

  HowWin:{ // H - V - D 
    type: DataTypes.STRING(128),
    allowNull: false
  },
  DateGame:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

  Ending: { //win or draw or abort
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  Time1: { //millieme de seconde que le joeur a mis pour jouer
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  Time2: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  map: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },

}, {
  tableName: 'GameMorp',
  timestamps: false, // désactive createdAt / updatedAt si tu n’en veux pas
});

User.hasMany(GameMorp, { foreignKey: 'Player1', onDelete: 'CASCADE' });
GameMorp.belongsTo(User, { foreignKey: 'Player1' });
User.hasMany(GameMorp, { foreignKey: 'Player2', onDelete: 'CASCADE' });
GameMorp.belongsTo(User, { foreignKey: 'Player2' });
User.hasMany(GameMorp, { foreignKey: 'iDWin', onDelete: 'CASCADE' });
GameMorp.belongsTo(User, { foreignKey: 'iDWin' });

export default GameMorp;

await GameMorp.create({HowWin: "D", DateGame: new Date(), Ending: "Win", Time1: time1, Time2: time2, map: , Player1: })





/*
CREATION TABLE PAR JOUEURS

*/