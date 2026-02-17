/* Css */
import "./Profile.css";

/* Components */
import { useState, useEffect } from "react";
import { VscEdit } from "react-icons/vsc";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Form } from "react-router-dom";
import AddressAutocomplete from "./AddressAutocomplete/AddressAutocomplete.jsx";

export default function Profile() {
    
    // change le state de readOnly pour les inputs du formulaire
    const [isReadOnly, setIsReadOnly] = useState(true);

    const [showFormPassword, setShowFormPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [user, setUser] = useState({
        login: "florent cretin",
        login42: "fcretin",
        email: "florent.cretin@hotmail.fr",
        tel: "0778800814",
        location: "Lyon"
    });


    const fetchUserData = async () => {

        console.log("fetchUserData(1) called");
        try {
            const rep = await fetch("/api/user/profile");
            const repjson = await rep.json();
            if (repjson.success){
                
                console.log("fetchUserData(2) User data fetched successfully:", repjson.message);
                setUser(repjson.message);

            }else{

                console.error("fetchUserData(3) Error:", repjson.message);
            
            }
        } catch (error) {
            console.error("fetchUserData(4) Error", error);
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

                        <label htmlFor="login">Login</label>
                        <input  type="text"
                                id="login"
                                name="login"
                                value={user.login}
                                readOnly={isReadOnly}
                                onChange={(e) => setUser({ ...user, login: e.target.value }) }
                                /> 

                        <label htmlFor="login42">Login-42</label>
                        <input  type="text"
                                id="login42"
                                name="login42"
                                value={user.login42}
                                readOnly={isReadOnly}
                                onChange={(e) => setUser({ ...user, login42: e.target.value }) }
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

                        <label htmlFor="location">Location</label>
                        <AddressAutocomplete value={user.location}/>

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

