/* extern */
import { FaGithub } from "react-icons/fa";

/* back */
import { showAlert } from "TOOL/fonction_usefull.js";

/* Css */
import "FRONT/page/Home/PopUp/PopUp.scss";

/* Components */
import { AUTH } from "FRONT/page/Home/Home.jsx"

import useFetch from "HOOKS/useFetch.jsx";


export default function Register({setShowLog}) {

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
        const url = `/api/auth/register`;
        console.log(`${url}`)
        console.log(data.name + " " + data.email + " " + data.password);

        const repjson = await useFetch(`${url}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        if (!repjson || (repjson &&  !repjson.success))
            return;
        setShowLog(AUTH.LOGIN);
    }

    function login_mode() {
        // console.log("login_mode(1) Passage en mode connection: ", AUTH.REGISTER);
        setShowLog(AUTH.LOGIN)
    }


    return (
        <>
            <div className={`script-in-root`}>

                <h4>Register</h4>
                
                <form id={`register`} className={``} onSubmit={register_submit}>


                    <label htmlFor={`name`}>Nickname</label>
                    <input type={`text`} id={`name`} name={`name`} placeholder={`XxX_DarkSasuke_XxX`}/>

                    <label htmlFor={`email`}>Email</label>
                    <input type={`email`} id={`email`} name={`email`} placeholder={`you@exemple.com`}/>

                    <label htmlFor={`password`}>Password</label>
                    <input type={`password`} id={`password`} name={`password`} placeholder={`1234btw`}/>

                    <div className={`button-container`}>

                        <button type={`submit`} className={``}>Register</button>
                        <button type={`button`} className={``} onClick={login_mode}>Connexion</button>

                    </div>

                </form>

            </div>
        </>
    )
}
