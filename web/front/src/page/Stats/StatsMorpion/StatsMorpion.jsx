/* Css */
import "./StatsMorpion.scss";

/* Components */
    
export default function StatsMorpion() {

    
    return (
        <>
            <div className={`StatsMorpion-root`}>
                <h4>Morpion</h4>

                <div className={`StatsMorpion-container`}>

                    <div className={`history`}>

                        {/* <h1>history function call</h1> */}
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>
                            <p className={``}>history</p>


                    </div>

    {/* ---------------------------------------------------------------------------- */}

                    <div className={`game-winrate`}>
                        
                        <div className={`wl-graph`}>
                            <p>Graph</p>
                        </div>

                        <div className={`wl-o-x`}>
                            <p>ox-win-loss</p>
                        </div>

                        <div className={`wl-horizontal`}>
                            <p>h</p>
                        </div>

                        <div className={`wl-diagonal`}>
                            <p>d</p>
                        </div>

                        <div className={`wl-vertical`}>
                            <p>v</p>
                        </div>

                    </div>

                </div>
            </div>{/* StatsMorpion-root */}
        </>
    )
}

// /* Css */
// import "./StatsMorpion.scss";

// /* Components */
    
// export default function StatsMorpion() {
//     return (
//         <>
//             <h4>Morpion</h4>
//             <div className="full StatsMorpion-parent">

//                 <div className="StatsMorpion-div StatsMorpion-div1">

//                     <div className="StatsMorpion-gap">

//                     {/* <h1>history function call</h1> */}
//                         <p className="border">history</p>
//                         <p className="border">history</p>
//                         <p className="border">history</p>
//                         <p className="border">history</p>
//                         <p className="border">history</p>

//                     </div>

//                 </div>

// {/* ---------------------------------------------------------------------------- */}

//                 <div className="StatsMorpion-div StatsMorpion-div2 StatsMorpion-gap">
                    
//                     <div className="StatsMorpion-graph border">
//                         <p>Graph</p>
//                     </div>

//                     <div className="StatsMorpion-ox-win-loss border">
//                         <p>ox-win-loss</p>
//                     </div>

//                     <div className="StatsMorpion-hdv border">
//                         <p>h</p>
//                     </div>

//                     <div className="StatsMorpion-hdv border">
//                         <p>d</p>
//                     </div>

//                     <div className="StatsMorpion-hdv border">
//                         <p>v</p>
//                     </div>

//                 </div>

//             </div>
//         </>
//     )
// }
