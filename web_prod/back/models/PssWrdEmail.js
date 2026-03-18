import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const PswEmail = sequelize.define('PswEmail', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    type:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idUser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Code:{
        type: DataTypes.STRING(512),
        allowNull: false,
    },
    DateCreate:{
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
  tableName: 'PswEmail',
  timestamps: false,
});

User.hasMany(PswEmail, {as: 'code', foreignKey: 'idUser' });

export default PswEmail;