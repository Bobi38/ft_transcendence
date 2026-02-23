/* Css */
import "./PopUp.scss";

/* Components */
import Login from "./script/Login.jsx"          // on essaie de ce co et rediriger MailA2F
import Register from "./script/Register.jsx"    // pas de compte cree nous en cree un et redirige vers Login
import MailA2F from "./script/MailA2F.jsx"      // on envoye un mail a titou donc faut pas clicker


import { AUTH } from "FRONT/page/Home/Home.jsx"

export default function PopUp({ setShowLog, showLog }) {

    

    return (

        <div id={`PopUp-root`}>


            <div id={`alert-container`}>
                {/* 
                    ne pas creat une div faire un innertext 
                    TITOU TODO FAUT FAIT PARTOUT MEME POUR MAILA2F
                */} 
            </div>

            {showLog === AUTH.LOGIN && <Login setShowLog={setShowLog}/>}
            {showLog === AUTH.MAILA2F && <MailA2F setShowLog={setShowLog}/>}
            {showLog === AUTH.REGISTER && <Register setShowLog={setShowLog}/>}


        </div>
    )
}
