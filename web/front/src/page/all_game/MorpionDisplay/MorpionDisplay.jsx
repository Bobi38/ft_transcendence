/* extern */
import { useEffect, useState } from "react";

/* back */
import checkCo from "BACK/fct1.js"

/* Css */
import "./MorpionDisplay.scss";

/* Components */
import Morpion from "./Morpion/Morpion";

    
export default function MorpionDisplay() {

    return (
    
        <div className={`MorpionDisplay-root border-base`}>
            
            <div className={`MorpionDisplay-last-game-played border-1`}>
                display les game en cours ou / deja fini 
            </div>

            <div className={`MorpionDisplay-game border-1`}>
                <Morpion/>
            </div>

        </div>

    )
}
