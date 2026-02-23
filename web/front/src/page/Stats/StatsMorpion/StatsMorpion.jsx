/* Css */
import "./StatsMorpion.scss";

/* Components */
    
export default function StatsMorpion() {

    /*
    fct1 fetch histo
        .Game LIMIT 5 = [
            GameID:[1: 
            {
                howWin: ,
                DateGame: ,
                Time: [],
                map:,
                id:{
                    meid:
                    WinnerId:,
                    Player: [],
                    }
            }
            GameID:[1: 
            {
                howWin: ,
                DateGame: ,
                Time: [],
                map:,
                id:{
                    meid:
                    WinnerId:,
                    Player: [],
                    }
            }
        ]

        .Stats = {
        }
    fct1 fetch stats
    



    useEffect(() => {
        fetch('/statmopr',)
        */
    
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
