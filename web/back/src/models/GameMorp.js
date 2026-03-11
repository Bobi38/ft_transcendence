import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const GameMorp = sequelize.define('GameMorp', {

  how_win: {
    type: DataTypes.ENUM("horizontal", "diagonal_lr", "diagonal_rl", "vertical", "abort", "draw"),
    allowNull: false
  },

  date_game:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

  ending: {
    type: DataTypes.ENUM('win', 'draw', 'abort'),
    allowNull: false,
  },

  player_1: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  player_2: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  winner: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  loser: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  time_player_1: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  time_player_2: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  nb_turn_player_1: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  nb_turn_player_2: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  map: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },

}, {
  tableName: 'GameMorp',
  timestamps: false,
});

User.hasMany(GameMorp, { foreignKey: 'player_1', as: 'gamesAsPlayer1', onDelete: 'CASCADE' });
GameMorp.belongsTo(User, { foreignKey: 'player_1', as: 'player1' });

User.hasMany(GameMorp, { foreignKey: 'player_2', as: 'gamesAsPlayer2', onDelete: 'CASCADE' });
GameMorp.belongsTo(User, { foreignKey: 'player_2', as: 'player2' });

User.hasMany(GameMorp, { foreignKey: 'winner', as: 'gamesWon', onDelete: 'CASCADE' });
GameMorp.belongsTo(User, { foreignKey: 'winner', as: 'winnerUser' });

User.hasMany(GameMorp, { foreignKey: 'loser', as: 'gamesLost', onDelete: 'CASCADE' });
GameMorp.belongsTo(User, { foreignKey: 'loser', as: 'loserUser' });

export default GameMorp;

// GameMorp.findAll({
//   include: [
//     { model: User, as: 'player1' },
//     { model: User, as: 'player2' },
//     { model: User, as: 'winnerUser' },
//     { model: User, as: 'loserUser' }
//   ]
// });

// const PlayerStats = sequelize.define('PlayerStats', {

//   player_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true
//   },

//   games: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0
//   },

//   wins: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0
//   },
// await PlayerStats.increment('wins', {
//   where: { player_id: id }
// });
