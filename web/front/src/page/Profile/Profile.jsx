/* extern */
import { useState, useEffect } from "react";
import { VscEdit, VscEye, VscEyeClosed } from "react-icons/vsc";

/*back*/
import { showAlert } from "BACK/fct1.js";

/* Css */
import "./Profile.scss";

/* Components */
import AddressAutocomplete from "./AddressAutocomplete/AddressAutocomplete.jsx";


export default function Profile() {
    
    const [showFormPassword, setShowFormPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(true);

    const [user, setUser] = useState({
        login: "",
        login42: "",
        email: "",
        tel: "",
        location: ""
    });

    const handle_pass = async (e) => {
        e.preventDefault();
        const password = e.target.password.value.trim();
        const confirmepassword = e.target.confirmepassword.value.trim();

        if (!password || !confirmepassword) {
            showAlert("Veuillez remplir tous les champs", "danger");
            return;
        }

        if (password !== confirmepassword) {
            showAlert("Les mots de passe ne correspondent pas", "danger");
            return;
        }

        const data ={
            Pass: password,
        }
        try{
            const rep = await fetch("/api/majPass", {
                method: "POST",
                headers : {"Content-Type" : "application/json",},
                credentials: "include",
                body: JSON.stringify(data)
            });

            const repp = await rep.json();
            if (repp.success)
                showAlert("Mot de passe mis à jour avec succès", "success");
            else
                console.log ("err passmaj" , repp.message);
        }catch(err){
            console.log(err);
        }
    }

    const handle_submit = async (e) => {
        e.preventDefault();

        if (!user.login || !user.login42 || !user.tel || !user.location || !user.email || !user.tel) {
            showAlert("Veuillez remplir tous les champs", "danger");
            return;
        }

        if (user.tel[0] !== '+' || user.tel[1] !== '3' || user.tel[2] !== '3' || user.tel.length < 10) {
            showAlert("Veuillez entrer un numéro de téléphone valide au format international (ex: +33612345678)", "danger");
            return;
        }

        try{
            const rep = await fetch("/api/updateProfil", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(user)
            });
            const repjson = await rep.json();
            if (repjson.success){
                showAlert("Profil mis à jour avec succès", "success");
            }else{
                console.error("Error updating profile:", repjson.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const fetch_user_data = async () => {
        
        console.log("fetch_user_data(1) called");
        try {
            const rep = await fetch("/api/profile" ,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const repjson = await rep.json();
            if (repjson.success){
                
                console.log("fetch_user_data(2) User data fetched successfully:", repjson.message);
                setUser(repjson.message);

            }else{

                console.error("fetch_user_data(3) Error:", repjson.message);
            
            }
        } catch (error) {
            console.error("fetch_user_data(4) Error", error);
        }

    };

    useEffect(() => {
        fetch_user_data();
    }, []);
    

    return (
        <>
            <div id={`Profile-root`}>


                <h3>Mon Profil</h3>


                <div className={`edit`} onClick={() => setIsReadOnly(!isReadOnly)}>{/* isReadOnly default true*/}
                     <VscEdit />{isReadOnly ? " Edit " : " Editing "}<VscEdit />  
                </div>


                <div id={`alert-container`}>
                    {/* ne pas creat une div faire un innertext */}
                </div>


                <div className={`form-container`}>

                    {/* <form className={``} onSubmit={handle_submit}>

                        <label htmlFor={`login`}>Login</label>
                        <input  type={`text`}
                                id={`login`}
                                name={`login`}
                                value={user.login ?? ""}
                                readOnly={isReadOnly}
                                onChange={(e) => setUser({ ...user, login: e.target.value }) }
                                /> 

                        <label htmlFor={`login42`}>Login-42</label>
                        <input  type={`text`}
                                id={`login42`}
                                name={`login42`}
                                value={user.login42 ?? ""}
                                readOnly={isReadOnly}
                                onChange={(e) => setUser({ ...user, login42: e.target.value }) }
                                /> 

                        <label htmlFor={`email`} className={``}>Email<span >Can't be changed</span></label>
                        <input  type={`email`}
                                id={`email`}
                                name={`email`}
                                title={`Can't be changed`}
                                value={user.email}
                                readOnly={true}
                                onChange={(e) => setUser({ ...user, email: e.target.value }) }
                                /> 


                        <label htmlFor={`tel`}>Téléphone</label> 
                        <input  type={`tel`}
                                id={`tel`}
                                name={`tel`}
                                value={user.tel ?? ""}
                                readOnly={isReadOnly}
                                onChange={(e) => setUser({ ...user, tel: e.target.value }) }
                                /> 

                        <label htmlFor={`location`}>Location</label>
                        <AddressAutocomplete user={user} setUser={setUser}/>

                        <button type={`submit`}>Modifier mes informations</button>
                        
                    </form> */}


                    <div className={`change-password`}
                         onClick={() => setShowFormPassword(!showFormPassword)}>
                        Changer de mot de passe


                        <div className={showFormPassword ? "visible" : "hidden"}>

                        {/* <form className={``} onSubmit={handle_pass}>

                                <label htmlFor={`password`}>Nouveau Mot de passe</label>
                                <div className={``}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id={`password`}
                                        name={`password`}
                                        placeholder={`Votre nouveau mot de passe`}
                                        />

                                    <span   className={``}
                                            onClick={() => setShowPassword(!showPassword)}
                                            >
                                        {showPassword ? <VscEyeClosed /> : <VscEye />}
                                    </span>
                                </div>


                                <label htmlFor={`confirmepassword`}>Confirmer Mot de passe</label>
                                <div className={``}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id={`confirmepassword`}
                                        name={`confirmepassword`}
                                        placeholder={`Confirmation du nouveau mot de passe`}
                                        />

                                    <span   className={`Profile-eye-icon`}
                                            onClick={() => setShowPassword(!showPassword)}
                                            >
                                        {showPassword ? <VscEyeClosed /> : <VscEye />}
                                    </span>
                                </div>

                                
                                <button type={`submit`}>Modifier mon mot de passe</button>
                            </form> */}
                        </div>
                    </div>

                </div>{/* className={`form-container`} */}

            </div>{/* id={`Profile-root`} */}
        </>
    )
}

