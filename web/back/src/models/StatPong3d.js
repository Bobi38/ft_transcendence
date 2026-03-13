import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const StatPong3d = sequelize.define('StatPong3d', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Player1id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Player2id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    whowin:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    wholose:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    score1:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    score2:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
  tableName: 'StatPong3d',
  timestamps: false,
});

// User.hasMany(StatPong3d, { foreignKey: 'Player1id', as: 'Pong3DAsPlayer1', onDelete: 'CASCADE' });
// StatPong3d.belongsTo(User, { foreignKey: 'Player1id', as: 'player1' });

// User.hasMany(StatPong3d, { foreignKey: 'Player2id', as: 'Pong3DAsPlayer2', onDelete: 'CASCADE' });
// StatPong3d.belongsTo(User, { foreignKey: 'Player2id', as: 'player2' });

// User.hasMany(StatPong3d, { foreignKey: 'whowin', as: 'Pong3DWon', onDelete: 'CASCADE' });
// StatPong3d.belongsTo(User, { foreignKey: 'whowin', as: 'winnerUser' });

// User.hasMany(StatPong3d, { foreignKey: 'wholose', as: 'Pong3DLost', onDelete: 'CASCADE' });
// StatPong3d.belongsTo(User, { foreignKey: 'wholose', as: 'loserUser' });

export default StatPong3d;
