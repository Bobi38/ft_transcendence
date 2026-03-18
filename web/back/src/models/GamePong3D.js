import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const GamePong3D = sequelize.define('GamePong3D', {
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
        defaultValue: null,
    },
    abortloser: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    winner: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    loser: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },

    date_game_start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    date_game_end: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
  tableName: 'GamePong3D',
  timestamps: false,
});

User.hasMany(GamePong3D, { foreignKey: 'id_player_1', as: 'Pong3DPlayer1', onDelete: 'CASCADE' });
GamePong3D.belongsTo(User, { foreignKey: 'id_player_1', as: 'player1' });

User.hasMany(GamePong3D, { foreignKey: 'id_player_2', as: 'Pong3DPlayer2', onDelete: 'CASCADE' });
GamePong3D.belongsTo(User, { foreignKey: 'id_player_2', as: 'player2' });

// User.hasMany(GamePong3D, { foreignKey: 'winner', as: 'Pong3DWon', onDelete: 'CASCADE' });
GamePong3D.belongsTo(User, { foreignKey: 'winner', as: 'winnerUser' });

// User.hasMany(GamePong3D, { foreignKey: 'loser', as: 'Pong3DLost', onDelete: 'CASCADE' });
GamePong3D.belongsTo(User, { foreignKey: 'loser', as: 'loserUser' });

export default GamePong3D;
