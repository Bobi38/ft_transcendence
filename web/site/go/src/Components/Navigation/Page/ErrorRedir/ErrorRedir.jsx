/* Css */
import "./ErrorRedir.css";

/* Components */
import { Link } from "react-router-dom";
    
export default function ErrorRedir() {
    return (
        <>
            <div className="ErrorRedir-root">

                <div>
                    <h1 className="error-redir-title">404</h1>
                    <p className="error-redir-text">Oups... La page que vous demandez n'existe pas.</p>
                </div>

                <div>
                    <Link to={`/`} >
                        <p>
                            LINK REDIRIGE VERS LA PAGE D'ACCUEIL
                        </p>
                    </Link>
                </div>
            
            </div>
        </>
    )
}
