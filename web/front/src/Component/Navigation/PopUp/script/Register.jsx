/* Css */
import "../PopUp.scss";

/* Components */
import { showAlert }        from    "TOOL/fonction_usefull.js";
import useFetch             from    "TOOL/useFetch.jsx";
import { AUTH, useAuth }    from    "HOOKS/useAuth.jsx";


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

    return (
        <div className={`script-in-root`}>

            <h1>Register</h1>

            <form id={`register`} onSubmit={(e) => {register_submit(e)}}>

				<label htmlFor={`name`}>Nickname</label>
				<input type={`text`} id={`name`} name={`name`} placeholder={`XxX_DarkSasuke_XxX`} required/>

                <label htmlFor={`email`}>Email</label>
                <input type={`email`} id={`email`} name={`email`} placeholder={`you@exemple.com`} required/>

                <label htmlFor={`password`}>Password</label>
                <input type={`password`} id={`password`} name={`password`} placeholder={`1234btw`} required/>

                <div>
                    <input type="checkbox" id="legal" name="legal" required />
                    <label htmlFor="legal">
                    I accept{" "}
                    <a href="/TermsAndPrivacy" target="_blank" rel="noopener noreferrer">
                    	Terms of Service and Privacy Policy
                    </a>
                    </label>
                </div>

                <button type={`submit`}>Register</button>
            </form>
			<hr />
			<button type={`button`} onClick={login_mode}>Connexion</button>
        </div>
    );
}
