/* extern */
import { useState, useEffect } from "react";
import { VscEdit, VscEye, VscEyeClosed } from "react-icons/vsc";

/*back*/
import { showAlert } from "TOOL/fonction_usefull.js";
import SocketM from "TOOL/SocketManag.js";

/* Css */
import "./Profile.scss";

/* Components */
import useFetch from "HOOKS/useFetch.jsx";

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


        const url = `/api/profile/majPass`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers : { "Content-Type" : "application/json" },
            credentials: "include",
            body: JSON.stringify({Pass: password})
        });
        if (!repjson || (repjson &&  !repjson.success))
            return;
        showAlert("Mot de passe mis à jour avec succès", "success");
        
    }

    const handle_submit = async (e) => {
        e.preventDefault();

        if (!user.login || !user.login42 || !user.tel || !user.email || !user.tel) {
            showAlert("Veuillez remplir tous les champs", "danger");
            return;
        }

        if (user.tel[0] !== '+' || user.tel[1] !== '3' || user.tel[2] !== '3' || user.tel.length < 10) {
            showAlert("Veuillez entrer un numéro de téléphone valide au format international (ex: +33612345678)", "danger");
            return;
        }

        const url = `/api/profile/updateProfil`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(user)
        });
        console.log(repjson.status + " " + repjson.success)        
        if (repjson && !repjson.success && repjson.status < 500 && repjson.status >= 400){
            showAlert(repjson.message, "danger");
            return;
        }
        if (!repjson || (repjson &&  !repjson.success))
            return;

        sessionStorage.setItem('username', repjson.username);
        console.log("oldname: ", repjson.oldname, " newname: ", repjson.username);
        if (repjson.oldname !== repjson.username) {
            SocketM.sendd('friend', {type: 'updateName', old_name: repjson.oldname, new_name: repjson.username});
            SocketM.sendd('chat', {type: 'updateName', old_name: repjson.oldname, new_name: repjson.username});
            SocketM.sendd('priv', {type: 'updateName', old_name: repjson.oldname, new_name: repjson.username});
            SocketM.sendd('morp', {type: 'updateName', old_name: repjson.oldname, new_name: repjson.username});
        }

        showAlert("Profil mis à jour avec succès", "success");
    };

    async function fetch_user_data(){
        const url = `/api/profile/profile`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!repjson || (repjson &&  !repjson.success))
            return;
        setUser(repjson.message)
    }

    useEffect(() => {
        fetch_user_data();
    }, []);
    

    return (
        <section className={`Profile-root`}>


            <h3>Mon Profil</h3>


            <div className={`edit`} onClick={() => setIsReadOnly(!isReadOnly)}>{/* isReadOnly default true*/}
                    <VscEdit />{isReadOnly ? " Edit " : " Editing "}<VscEdit />  
            </div>


            <div id={`alert-container`}></div>


            <div className={`form-container`}>

                <form className={``} onSubmit={handle_submit}>

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

                    <label htmlFor={`email`} className={``}>Email</label>
                    <input  type={`email`}
                            id={`email`}
                            name={`email`}
                            title={`Can't be changed`}
                            value={user.email}
                            readOnly={true}
                            onChange={(e) => setUser({ ...user, email: e.target.value }) }
                            disabled/> 


                    <label htmlFor={`tel`}>Téléphone</label> 
                    <input  type={`tel`}
                            id={`tel`}
                            name={`tel`}
                            value={user.tel ?? ""}
                            readOnly={isReadOnly}
                            onChange={(e) => setUser({ ...user, tel: e.target.value }) }
                            /> 

                    <button type={`submit`}>Modifier mes informations</button>
                </form>

				<hr />

                <button className={`change-password`} onClick={() => setShowFormPassword(!showFormPassword)}>
                    Changer de mot de passe
                </button>

                <div className={showFormPassword ? "visible" : "hidden"}>

                    <form className="password-form" onSubmit={handle_pass}>

                        <label htmlFor="password">Nouveau Mot de passe</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="password-field"
                                placeholder="Votre nouveau mot de passe"
                            />
                            <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VscEyeClosed /> : <VscEye />}
                            </span>
                        </div>

                        <label htmlFor="confirmepassword">Confirmer Mot de passe</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmepassword"
                                name="confirmepassword"
                                className="password-field"
                                placeholder="Confirmation du nouveau mot de passe"
                            />
                            <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VscEyeClosed /> : <VscEye />}
                            </span>
                        </div>

                        <button type="submit" className="submit-btn">Modifier mon mot de passe</button>
                    
                    </form>

                </div>
            </div>

        </section>
    )
}

