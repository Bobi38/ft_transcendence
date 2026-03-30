import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const StatPong3D = sequelize.define('StatPong3D', {
    //id user
    idUser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // game stats
    total_game:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time_played:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    win:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lose:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    abortwinner: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    abortloser: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_ballhit:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
  tableName: 'StatPong3D',
  timestamps: false,
});


export default StatPong3D;
