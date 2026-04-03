import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import StatMorp from './StatMorp.js';
import StatPong3D from './StatPong3D.js';


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  Log42: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  mail: {
    type: DataTypes.STRING(256),
    allowNull: false,
    unique: true,
  },
  adress: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  OAuth: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  
  },
  MPFA: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,  
  },
  co:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  password_2FA: {
    type: DataTypes.STRING(256),
    allowNull: true,
  },
  password_2FA_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  Hostlastco: {
    type: DataTypes.STRING(256),
    allowNull: true,
    defaultValue: null,
  },
  Datelastco: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'user_co',
  timestamps: false, // désactive createdAt / updatedAt si tu n’en veux pas
});

User.hasMany(StatMorp, { as: 'statMorp', foreignKey: 'idUser' });
User.hasMany(StatPong3D, { as: 'statPong3D', foreignKey: 'idUser' });

User.afterCreate(async (user, options) => {
    await StatMorp.create({
        idUser: user.id,
        total_game: 0,
        time_played: 0,
        nb_turn_played: 0,
        type_X_horizontal_winner: 0,
        type_X_horizontal_loser: 0,
        type_X_vertical_winner: 0,
        type_X_vertical_loser: 0,
        type_X_diagonal_winner: 0,
        type_X_diagonal_loser: 0,
        type_X_abort_winner: 0,
        type_X_abort_loser: 0,
        type_X_draw: 0,
        type_O_horizontal_winner: 0,
        type_O_horizontal_loser: 0,
        type_O_vertical_winner: 0,
        type_O_vertical_loser: 0,
        type_O_diagonal_winner: 0,
        type_O_diagonal_loser: 0,
        type_O_abort_winner: 0,
        type_O_abort_loser: 0,
        type_O_draw: 0,
    });
    await StatPong3D.create({
        idUser: user.id,
        total_game: 0,
        time_played: 0,
        win:0,
        lose:0,
        abortwinner:0,
        abortloser:0,
        total_ballhit:0
    });
});



export default User;
