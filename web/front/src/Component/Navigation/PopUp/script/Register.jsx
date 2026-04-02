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


export default function Register() {

    const {setShowLog, showLog} = useAuth();
    const [showPrivacy, setShowPrivacy] = useState(false);



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
        console.log("register_submit:", repjson);
        if (repjson.status < 500 && repjson.status >= 400){
            showAlert(`${repjson.message}`, "danger");
            return ;
        }
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

                <h1>Register</h1>
                
                <form id={`register`} className={``} onSubmit={register_submit}>


                    <label htmlFor={`name`}>Nickname</label>
                    <input type={`text`} id={`name`} name={`name`} placeholder={`XxX_DarkSasuke_XxX`}/>

                    <label htmlFor={`email`}>Email</label>
                    <input type={`email`} id={`email`} name={`email`} placeholder={`you@exemple.com`}/>

                    <label htmlFor={`password`}>Password</label>
                    <input type={`password`} id={`password`} name={`password`} placeholder={`1234btw`}/>


                    <div style={{display: "flex", gap: "5px"}}>
                        <input id="checkboxInput" type="checkbox" />
                        <label for="checkboxInput" defaultChecked={showPrivacy} ><span onClick={() => setShowPrivacy(!showPrivacy)}>Accept Privacy Policy and Terms of Service</span></label>
                    </div>
                    <div className={`button-container`}>

                        <button type={`submit`} className={``}>Register</button>
                        <button type={`button`} className={``} onClick={login_mode}>Connexion</button>

                    </div>

                </form>

                {showPrivacy && (
                    <div className="policy">
                        <h1>Privacy Policy and Terms of Service</h1>
                        <p>Privacy Policy (Core Clauses)
                            Information Collection: "We collect personal identifiers (name, email), usage data via cookies, and device information (IP address)."<br/>
                            Use of Data: "Data is used to provide services, process transactions, and improve user experience."<br/>
                            Legal Basis: "Processing is based on contractual necessity, legitimate interest, or explicit user consent."<br/>
                            Data Retention: "Personal data is kept only as long as necessary for the purposes outlined or to comply with legal obligations."<br/>
                            User Rights: "Users may request access, correction, or deletion of their data by contacting [Email Address]."<br/>
                            Third-Party Sharing: "We do not sell data. We only share information with essential service providers (e.g., hosting, payment processors)."<br/>
                            Terms of Service (Core Clauses)
                            Acceptance of Terms: "By accessing this service, you agree to be bound by these terms and all applicable laws."<br/>
                            Intellectual Property: "All content, features, and functionality are the exclusive property of [Company Name] and are protected by copyright laws."<br/>
                            User Conduct: "Users are prohibited from using the service for any unlawful purpose or to transmit malicious code."<br/>
                            Limitation of Liability: "The service is provided 'as is'. In no event shall [Company Name] be liable for any indirect or consequential damages."<br/>
                            Termination: "We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any breach of these Terms."<br/>
                            Governing Law: "These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction/Country]."<br/>
                            chaussure.
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}
