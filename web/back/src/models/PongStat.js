import { DataTypes } from 'sequelize';
import sequelize from './index.js';
// import User from './user.js';

const PongStat = sequelize.define('PongStat', {
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
  tableName: 'PongStat',
  timestamps: false,
});

// User.hasMany(PongStat, { foreignKey: 'Player1id', as: 'Pong3DAsPlayer1', onDelete: 'CASCADE' });
// PongStat.belongsTo(User, { foreignKey: 'Player1id', as: 'player1' });

// User.hasMany(PongStat, { foreignKey: 'Player2id', as: 'Pong3DAsPlayer2', onDelete: 'CASCADE' });
// PongStat.belongsTo(User, { foreignKey: 'Player2id', as: 'player2' });

// User.hasMany(PongStat, { foreignKey: 'whowin', as: 'Pong3DWon', onDelete: 'CASCADE' });
// PongStat.belongsTo(User, { foreignKey: 'whowin', as: 'winnerUser' });

// User.hasMany(PongStat, { foreignKey: 'wholose', as: 'Pong3DLost', onDelete: 'CASCADE' });
// PongStat.belongsTo(User, { foreignKey: 'wholose', as: 'loserUser' });

export default PongStat;
