import { DataTypes } from 'sequelize';
import sequelize from './index.js';


const StatMorp = sequelize.define('StatMorp', {
    idUser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_game:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time_played:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nb_turn_played:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_X_horizontal_winner:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_X_horizontal_loser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_X_vertical_winner:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_X_vertical_loser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_X_diagonal_winner:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_X_diagonal_loser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_X_abort_winner:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_X_abort_loser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_X_draw:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_O_horizontal_winner:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_O_horizontal_loser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_O_vertical_winner:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_O_vertical_loser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_O_diagonal_winner:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_O_diagonal_loser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_O_abort_winner:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_O_abort_loser:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_O_draw:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
  tableName: 'StatMorp',
  timestamps: false,
});


//     my_id: 1,
//     history: [
//         {
//             gameid: 1,
//             game_stats:{
                
//                 map: "OX--XO-XO",
//                 //has_result: {same winner_id = green / not same winner_is = red}, "draw,abort" = blue
//                 game_result: "has_result,draw,abort",
//                 id_user: {
//                     //null !has_result
//                     winner_id: 1,//if is not my id i have lost
//                     player:  [
//                         {id:1, ox: 'X'},
//                         {id:2, ox: 'O'}
//                     ]
//                 },
//             }
//         },
//         {
//             gameid: 2,
//             game_stats:{
                
//                 map: "OX--XO-XO",
//                 //has_result: {same winner_id = green / not same winner_is = red}, "draw,abort" = blue
//                 game_result: "has_result,draw,abort",
//                 id_user: {
//                     //null !has_result
//                     winner_id: 2,//if is not my id i have lost
//                     player: [
//                         {id:1, ox: 'X'},
//                         {id:2, ox: 'O'}
//                     ]
//                 },
//             }
//         }
//     ],

export default StatMorp;