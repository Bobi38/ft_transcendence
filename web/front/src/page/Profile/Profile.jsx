/* extern */
import { useState, useEffect }      from    "react";
import { VscEye, VscEyeClosed }     from    "react-icons/vsc";

/* Css */
import "./Profile.scss";

/* Components */
import { showAlert }                from    "TOOL/fonction_usefull.js";
import SocketM                      from    "TOOL/SocketManag.js";
import useFetch                     from    "TOOL/useFetch.jsx";
import { AUTH, useAuth }            from    "HOOKS/useAuth.jsx"

export default function Profile() {

    const [showPassword, setShowPassword] = useState(false);
    const { showLog } = useAuth();

    const [user, setUser] = useState({ login: "", tel: "", });

    const handle_pass = async (e) => {
        e.preventDefault();
        const password = e.target.password.value;
        const confirmePassword = e.target.confirmePassword.value;

        if (!password || !confirmePassword) {
            showAlert("Veuillez remplir tous les champs", "danger");
            return;
        }

        if (password !== confirmePassword) {
            showAlert("Les mots de passe ne correspondent pas", "danger");
            return;
        }

        const url = `/api/profile/password`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "PATCH",
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

        const url = `/api/profile`;

        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "PUT",
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
        const url = `/api/profile`;

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

            <h1>Mon Profil</h1>

            <div id={`alert-container`}></div>

            <div className={`form-container`}>

                <form onSubmit={handle_submit}>

                    <label htmlFor={`login`}>Login</label>
                    <input  type={`text`}
                            id={`login`} name={`login`}
                            value={user.login ?? ""}
                            onChange={(e) => setUser({ ...user, login: e.target.value }) }
                        />


                    <label htmlFor={`email`}>Email</label>
                    <input  type={`email`}
                            id={`email`} name={`email`}
                            title={`Can't be changed`}
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value }) }
                            disabled/>


                    <label htmlFor={`tel`}>Téléphone</label>
                    <input  type={`tel`}
                            id={`tel`} name={`tel`}
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
                                id="password" name="password"
                                className="password-field"
                                placeholder="Votre nouveau mot de passe"
                            />
                            <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VscEyeClosed /> : <VscEye />}
                            </span>
                        </div>

                        <label htmlFor="confirmePassword">Confirmer Mot de passe</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmePassword" name="confirmePassword"
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

            <div className={`Navbar-policy`}>
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Politique de confidentialité
                </a>

                <a href="/terms" target="_blank" rel="noopener noreferrer">
                Conditions d'utilisation
                </a>
            </div>
        </section>
    );
}

