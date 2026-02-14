/* Css */
import "./Profile.css";

/* Components */
import { useState, useEffect } from "react";
import { VscEdit } from "react-icons/vsc";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Form } from "react-router-dom";


export default function Profile() {
    
    // change le state de readOnly pour les inputs du formulaire
    const [isReadOnly, setIsReadOnly] = useState(true);

    const [showFormPassword, setShowFormPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [user, setUser] = useState({
        firstName: "florent",
        lastName: "cretin",
        email: "florent.cretin@hotmail.fr",
        tel: "0778800814"
    });


    const fetchUserData = async () => {
        try {
            const response = await fetch("/api/user/profile");
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        // fetchUserData();
    }, []);
    


    return (
        <>

            <div className="full Profile-bg center Profile-container">

                <h1>Mon Profil</h1>

                <div    className="Profile-edit"
                        onClick={() => setIsReadOnly(!isReadOnly)}>
                    <VscEdit />   {isReadOnly ? " Edit" : " Editing"}
                </div>


                <div className="Profile-container">

                    <form className="Profile-form" onSubmit={(e) => {
                        e.preventDefault();
                    }}>


                        <label htmlFor="firstName">Prénom</label>
                        <input  type="text"
                                id="firstName"
                                name="firstName"
                                value={user.firstName}
                                readOnly={isReadOnly}
                                onChange={(e) => setUser({ ...user, firstName: e.target.value }) }
                                /> 

                        <label htmlFor="lastName">Nom</label> 
                        <input  type="text"
                                id="lastName"
                                name="lastName"
                                value={user.lastName}
                                readOnly={isReadOnly}
                                onChange={(e) => setUser({ ...user, lastName: e.target.value }) }
                                /> 

                        <label htmlFor="email" className="Profile-cant-change">Email<span >Can't be changed</span></label>
                        <input  type="email"
                                id="email"
                                name="email"
                                title="Can't be changed"
                                value={user.email}
                                readOnly={true}
                                onChange={(e) => setUser({ ...user, email: e.target.value }) }
                                /> 


                        <label htmlFor="tel">Téléphone</label> 
                        <input  type="text"
                                id="tel"
                                name="tel"
                                value={user.tel}
                                readOnly={isReadOnly}
                                onChange={(e) => setUser({ ...user, tel: e.target.value }) }
                                /> 

                        <button type="submit">Modifier mes informations</button>
                    </form>


                    <div    className="Profile-change-password"
                            onClick={() => setShowFormPassword(!showFormPassword)}>
                        Changer de mot de passe
                    </div>

                    
                    <div className={showFormPassword? "visible" : "hidden"}>

                        <form className="Profile-form" onSubmit={(e) => {
                            e.preventDefault();
                        }}>

                            <label htmlFor="password">Nouveau Mot de passe</label>
                            <div className="Profile-password">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Votre nouveau mot de passe"
                                    />

                                <span   className="Profile-eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                        >
                                    {showPassword ? <VscEyeClosed /> : <VscEye />}
                                </span>
                            </div>


                            <label htmlFor="confirmepassword">Confirmer Mot de passe</label>
                            <div className="Profile-password">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmepassword"
                                    name="confirmepassword"
                                    placeholder="Confirmation du nouveau mot de passe"
                                    />

                                <span   className="Profile-eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                        >
                                    {showPassword ? <VscEyeClosed /> : <VscEye />}
                                </span>
                            </div>

                            
                            <button type="submit">Modifier mon mot de passe</button>
                        </form>
                    </div>

                </div>
            </div>
        </>
    )
}

