import GameMorp from "../models/GameMorp.js";

export async function seedGameMorp() {
  const count = await GameMorp.count();

  if (count === 0) {
    await GameMorp.bulkCreate([
      {
        how_win: "D",
        date_game: "2026-03-04 12:52:22",
        ending: "win",
        player_1: 5,
        player_2: 1,
        winner: 1,
        loser: 5,
        time_player_1: 6022,
        time_player_2: 11722,
        nb_turn_player_1: 3,
        nb_turn_player_2: 4,
        map: "-OX-XXXOO"
      },
      {
        how_win: "V",
        date_game: "2026-03-04 12:52:39",
        ending: "win",
        player_1: 5,
        player_2: 1,
        winner: 1,
        loser: 5,
        time_player_1: 2208,
        time_player_2: 7015,
        nb_turn_player_1: 2,
        nb_turn_player_2: 3,
        map: "-OX-OX--X"
      },
      {
        how_win: "D",
        date_game: "2026-03-04 12:53:01",
        ending: "win",
        player_1: 1,
        player_2: 5,
        winner: 5,
        loser: 1,
        time_player_1: 4928,
        time_player_2: 6928,
        nb_turn_player_1: 3,
        nb_turn_player_2: 4,
        map: "--XOXOXXO"
      },
      {
        how_win: "H",
        date_game: "2026-03-04 12:53:23",
        ending: "win",
        player_1: 5,
        player_2: 1,
        winner: 1,
        loser: 5,
        time_player_1: 2744,
        time_player_2: 9879,
        nb_turn_player_1: 2,
        nb_turn_player_2: 3,
        map: "----OOXXX"
      },
      {
        how_win: "0",
        date_game: "2026-03-04 13:53:23",
        ending: "draw",
        player_1: 5,
        player_2: 1,
        winner: null,
        loser: null,
        time_player_1: 4744,
        time_player_2: 18879,
        nb_turn_player_1: 5,
        nb_turn_player_2: 4,
        map: "OOXXXOOXX"
      },
      {
        how_win: "D",
        date_game: "2026-03-04 14:52:22",
        ending: "win",
        player_1: 5,
        player_2: 1,
        winner: 1,
        loser: 5,
        time_player_1: 6022,
        time_player_2: 11722,
        nb_turn_player_1: 3,
        nb_turn_player_2: 4,
        map: "-OX-XXXOO"
      },
      {
        how_win: "V",
        date_game: "2026-03-04 14:52:39",
        ending: "win",
        player_1: 5,
        player_2: 2,
        winner: 2,
        loser: 5,
        time_player_1: 2208,
        time_player_2: 7015,
        nb_turn_player_1: 2,
        nb_turn_player_2: 3,
        map: "-OX-OX--X"
      },
      {
        how_win: "D",
        date_game: "2026-03-04 14:53:01",
        ending: "win",
        player_1: 2,
        player_2: 4,
        winner: 4,
        loser: 2,
        time_player_1: 4928,
        time_player_2: 6928,
        nb_turn_player_1: 3,
        nb_turn_player_2: 4,
        map: "--XOXOXXO"
      },
      {
        how_win: "H",
        date_game: "2026-03-04 14:53:23",
        ending: "win",
        player_1: 5,
        player_2: 1,
        winner: 1,
        loser: 5,
        time_player_1: 12744,
        time_player_2: 19879,
        nb_turn_player_1: 2,
        nb_turn_player_2: 3,
        map: "----OOXXX"
      },
      {
        how_win: "0",
        date_game: "2026-03-04 14:53:23",
        ending: "draw",
        player_1: 5,
        player_2: 3,
        winner: null,
        loser: null,
        time_player_1: 8744,
        time_player_2: 19879,
        nb_turn_player_1: 5,
        nb_turn_player_2: 4,
        map: "OOXXXOOXX"
      }
    ]);

    console.log("✅ GameMorp seed inséré");
  }
}