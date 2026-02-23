/* Css */
import "./StatsMorpion.scss";

/* Components */
    
export default function StatsMorpion() {

    // const data = {
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
    //     stat_user:{
    //         total_game:20,
    //         win:{
    //             O_side:5,
    //             X_side:5,
    //             type: {
    //                 horizontal:1,
    //                 vertical:1,
    //                 diagonal:1,
    //             }
    //         },
    //         lost:{
    //             O_side:5,
    //             X_side:5,
    //             type: {
    //                 horizontal:1,
    //                 vertical:1,
    //                 diagonal:1,
    //             }
    //         },
    //         draw: {
    //             O_side:5,
    //             X_side:5,
    //             type: {
    //                 horizontal:1,
    //                 vertical:1,
    //                 diagonal:1,
    //             }
    //         },
    //         abort:{
    //             O_side:5,
    //             X_side:5,
    //             type: {
    //                 horizontal:1,
    //                 vertical:1,
    //                 diagonal:1,
    //             }
    //         },
    //     }
    // }

    return (
        <div className={`StatsMorpion-root`}>

                <div className={`history`}>

                    {/* <h1>history function call</h1> */}
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>
                    <div className={`border `}>history</div>

                </div>

{/* ------------------------------------------------------------------------ */}

            <div className={`game-winrate`}>
                    
                    <div className={`border wl-graph`}>
                        <p>Graph</p>
                    </div>

                    <div className={`border wl-o-x`}>
                        <p>ox-win-loss</p>
                    </div>

                    <div className={`border wl-horizontal`}>
                        <p>h</p>
                    </div>

                    <div className={`border wl-diagonal`}>
                        <p>d</p>
                    </div>

                    <div className={`border wl-vertical`}>
                        <p>v</p>
                    </div>

            </div>{/* game-winrate */}
{/* StatsMorpion-root */}
        </div>
    )
}
