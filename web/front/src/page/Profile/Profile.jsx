/* extern */
import { useState, useEffect } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

/*back*/
import { showAlert } from "TOOL/fonction_usefull.js";
import SocketM from "TOOL/SocketManag.js";

/* Css */
import "./Profile.scss";

/* Components */
import useFetch from "HOOKS/useFetch.jsx";

export default function Profile() {

    const [showPassword, setShowPassword] = useState(false);

    const [user, setUser] = useState({ login: "", tel: "", });

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

        if (!user.login || !user.tel) {
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

            <div id={`alert-container`}></div>


            <div className={`form-container`}>

                <form className={``} onSubmit={handle_submit}>

                    <label htmlFor={`login`}>Login</label>
                    <input  type={`text`}
                            id={`login`}
                            name={`login`}
                            value={user.login ?? ""}
                            onChange={(e) => setUser({ ...user, login: e.target.value }) }
                        />


                    <label htmlFor={`email`} className={``}>Email</label>
                    <input  type={`email`}
                            id={`email`}
                            name={`email`}
                            title={`Can't be changed`}
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value }) }
                            disabled/>


                    <label htmlFor={`tel`}>Téléphone</label>
                    <input  type={`tel`}
                            id={`tel`}
                            name={`tel`}
                            value={user.tel ?? ""}
                            onChange={(e) => setUser({ ...user, tel: e.target.value }) }
                            />

                    <button type={`submit`}>Modifier mes informations</button>
                </form>

				<hr />

                <div>

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

