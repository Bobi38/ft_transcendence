import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

// {
//     gameid: 1,
//     game_stats:{
        
//         map: "OX--XO-XO",

//         //has_result: {same winner_id = green / not same winner_is = red}, "draw,abort" = blue
//         game_result: "has_result,draw,abort",
//         id_user: {
//             //null !has_result
//             winner_id: 1,//if is not my id i have lost
//             player:  [
//                 {id:1, ox: 1 //X},
//                 {id:2, ox: 0 //O}
//             ]
//         },
//     }

const HistoryMorp = sequelize.define('HistoryMorp', {
    id:{// gameid
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    // game_stats
        Map:{//map:
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        Result:{// game_result
            type: DataTypes.STRING(11),
            allowNull: false,
        },
        // id_user
            WinnerId:{//winner_id
                type: DataTypes.STRING(11),
                allowNull: false,
            },
            // player
                Id1:{
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                OX1:{
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                Id2:{
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                OX1:{
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
}, {
  tableName: 'HistoryMorp',
  timestamps: false,
});

// User.hasMany(HistoryMorp, {as: 'HistoryMorp', foreignKey: 'Id1' });
// User.hasMany(HistoryMorp, {as: 'HistoryMor', foreignKey: 'Id2' });

export default HistoryMorp;

