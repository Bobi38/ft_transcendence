/* extern */
import { useState } from "react";
import { FaGithub } from "react-icons/fa";

/* back */
import { showAlert } from "TOOL/fonction_usefull.js";

/* Css */
import "../PopUp.scss";

/* Components */
import { AUTH, useAuth } from "TOOL/AuthContext.jsx";

import useFetch from "HOOKS/useFetch.jsx";


export default function Register({login_mode}) {

    const {setShowLog} = useAuth();

    async function register_submit(e){

        e.preventDefault();
        const form = e.target;
        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value.trim()
        };

        if (!data.name || !data.email || !data.password) {
            showAlert("Missing value", 'danger');
            return;
        }
        const url = `/api/auth/user`;
        console.log(`${url}`)
        console.log(data.name + " " + data.email + " " + data.password);

        const repjson = await useFetch(`${url}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }, null, null, true);
        console.log("register_submit:", repjson);
        if (repjson.status < 500 && repjson.status >= 400){
            showAlert(`${repjson.message}`, "danger");
            return ;
        }
        if (!repjson || (repjson &&  !repjson.success))
            return;
        setShowLog(AUTH.LOGIN);
    }

    async function login_mode() {
        sessionStorage.clear();
        const url = `/api/secu/cookie`;
        console.log(`${url}`)

        const repjson = await useFetch(`${url}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credential: "include",
        }, null, null, true)
        setShowLog(AUTH.LOGIN);
    }


    return (
        <>
            <div className={`script-in-root`}>

                <h1>Register</h1>
                
                <form id={`register`} onSubmit={(e) => {register_submit(e)}}>


                    <label htmlFor={`name`}>Nickname</label>
                    <input type={`text`} id={`name`} name={`name`} placeholder={`XxX_DarkSasuke_XxX`}/>

                    <label htmlFor={`email`}>Email</label>
                    <input type={`email`} id={`email`} name={`email`} placeholder={`you@exemple.com`}/>

                    <label htmlFor={`password`}>Password</label>
                    <input type={`password`} id={`password`} name={`password`} placeholder={`1234btw`}/>

                    <div style={{ marginTop: "10px" }}>
                        <input type="checkbox" id="legal" name="legal" required />
                        <label htmlFor="legal" style={{ marginLeft: "5px" }}>
                        J'accepte les{" "}
                        <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"underline",textDecorationColor:"red", textDecorationStyle:"solid"  }}>
                        Conditions d'utilisation
                        </a>{" "}
                        et la{" "}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"underline",textDecorationColor:"red", textDecorationStyle:"solid" }}>
                        Politique de confidentialité
                        </a>
                        </label>
                    </div>

                    <button type={`submit`}>Register</button>
                    <button type={`button`} onClick={login_mode}>Connexion</button>
                </form>

            </div>
        </>
    )
}
