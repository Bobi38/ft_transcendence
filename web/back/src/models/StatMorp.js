import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const StatMorp = sequelize.define('StatMorp', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },    
    idUser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nbGame:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Win:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Lost:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Draw:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Abort:{
         type: DataTypes.INTEGER,
         allowNull: false,
    },
    WinDiag:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    WinHoriz:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    WinVert:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    LoseDiag:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    LoseHoriz:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    LoseVert:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
  tableName: 'StatMorp',
  timestamps: false,
});

User.hasMany(StatMorp, {as: 'statMorp', foreignKey: 'idUser' });

export default StatMorp;