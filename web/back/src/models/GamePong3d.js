import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const GamePong3d = sequelize.define('GamePong3d', {
    //id de la partie
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    //info des joueur
    id_player_1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score_1: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_player_2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score_2: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    //info de la partie
    abortwinner: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    abortloser: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    winner: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    loser: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    date_game_start: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    date_game_end: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
    

}, {
  tableName: 'GamePong3d',
  timestamps: false,
});

User.hasMany(GamePong3d, { foreignKey: 'id_player_1', as: 'Pong3DPlayer1', onDelete: 'CASCADE' });
GamePong3d.belongsTo(User, { foreignKey: 'id_player_1', as: 'player1' });

User.hasMany(GamePong3d, { foreignKey: 'id_player_2', as: 'Pong3DPlayer2', onDelete: 'CASCADE' });
GamePong3d.belongsTo(User, { foreignKey: 'id_player_2', as: 'player2' });

User.hasMany(GamePong3d, { foreignKey: 'winner', as: 'gamesWon', onDelete: 'CASCADE' });
GamePong3d.belongsTo(User, { foreignKey: 'winner', as: 'winnerUser' });

User.hasMany(GamePong3d, { foreignKey: 'loser', as: 'gamesLost', onDelete: 'CASCADE' });
GamePong3d.belongsTo(User, { foreignKey: 'loser', as: 'loserUser' });

export default GamePong3d;
