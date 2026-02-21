/* Css */
import "FRONT/page/Home/PopUp/PopUp.scss";
import { showAlert } from "/app/back/src/fct1.js";
import { AUTH } from "../../Home.jsx"

export default function Register({setShowLog}) {


    const register_submit = async (event) => {

        event.preventDefault();

        const form = event.target;
        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value.trim()
        };

        if (!data.name || !data.email || !data.password) {
            showAlert("register_submit(1) Missing value", 'danger');
            return;
        }
        console.log(data.name + " " + data.email + " " + data.password);
        try {
            const reponse = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await reponse.json();

            if (result.success) {
                setShowLog(AUTH.LOGIN);
            } else {
                showAlert("register_submit(2)" + result.message, 'danger');
            }
        } catch (error) {
            console.error("register_submit(3) Server error", error);
        }
    };

    function login_mode() {
        console.log("login_mode(1) Passage en mode connection: ", AUTH.REGISTER);
        setShowLog(AUTH.LOGIN)
    }


    return (
        <>
            <div className={`PopUp-in-root`}>

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
