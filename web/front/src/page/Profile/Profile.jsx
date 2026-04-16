/* extern */
import { useState, useEffect }      from    "react";
import { Link }      from    "react-router-dom";
import { VscEye, VscEyeClosed }     from    "react-icons/vsc";

/* Css */
import "./Profile.scss";

/* Components */
import { showAlert }                from    "TOOL/fonction_usefull.js";
import SocketM                      from    "TOOL/SocketManag.js";
import useFetch                     from    "TOOL/useFetch.jsx";

export default function Profile() {

    const [showPassword, setShowPassword] = useState(false);

    const [user, setUser] = useState({ login: "", tel: "", });
    const [pass, setPass] = useState(false);

    const handle_pass = async (e) => {
        e.preventDefault();
        const password = e.target.password.value;
        const confirmePassword = e.target.confirmePassword.value;

        if (!password || !confirmePassword) {
            showAlert("Fill all input", "danger");
            return;
        }

        if (password !== confirmePassword) {
            showAlert("Passwords dont match", "danger");
            return;
        }

        const url = `/api/secu/majPswd_profil`;


        const repjson = await useFetch(`${url}`, {
            method: "PATCH",
            headers : { "Content-Type" : "application/json" },
            credentials: "include",
            body: JSON.stringify({new_psd: password})
        });        
        if (repjson && !repjson.success && repjson.status < 500){
            showAlert(repjson.message, "danger");
            return;
        }
        if (!repjson || (repjson &&  !repjson.success))
            return;
        showAlert("Password update with success", "success");

    }

    const handle_submit = async (e) => {
        e.preventDefault();

        if (!user.login || !user.tel) {
            showAlert("Fill all input", "danger");
            return;
        }

        if (user.tel[0] !== '+' || user.tel[1] !== '3' || user.tel[2] !== '3' || user.tel.length < 10) {
            showAlert("Use international notation (ex: +33612345678)", "danger");
            return;
        }

        const url = `/api/profile`;


        const repjson = await useFetch(`${url}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(user)
        });
        if (repjson && !repjson.success && repjson.status < 500 && repjson.status >= 400){
            showAlert(repjson.message, "danger");
            return;
        }
        if (!repjson || (repjson &&  !repjson.success))
            return;

        sessionStorage.setItem('username', repjson.username);
        if (repjson.oldname !== repjson.username) {
            SocketM.sendd('friend', {type: 'updateName', old_name: repjson.oldname, new_name: repjson.username});
            SocketM.sendd('chat', {type: 'updateName', old_name: repjson.oldname, new_name: repjson.username});
            SocketM.sendd('priv', {type: 'updateName', old_name: repjson.oldname, new_name: repjson.username});
            SocketM.sendd('morp', {type: 'updateName', old_name: repjson.oldname, new_name: repjson.username});
        }

        showAlert("Success update profile", "success");
    };

    async function fetch_user_data(){
        const url = `/api/profile`;


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

            <h1>My profile</h1>

            <p id={`alert-container`}></p>

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
                            value={user.email ?? ""}
                            onChange={(e) => setUser({ ...user, email: e.target.value }) }
                            disabled/>


                    <label htmlFor={`tel`}>Phone Number</label>
                    <input  type={`tel`}
                            id={`tel`} name={`tel`}
                            value={user.tel ?? ""}
                            onChange={(e) => setUser({ ...user, tel: e.target.value }) }
                            />

                    <button type={`submit`}>Update my informations</button>
                </form>

				<hr />

                <div>
                    <h2>Change Password</h2>
                    {pass?(
                        <form className="password-form" onSubmit={handle_pass}>

                            <label htmlFor="password">New password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password" name="password"
                                    className="password-field"
                                    placeholder="Password"
                                />
                                <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VscEyeClosed /> : <VscEye />}
                                </span>
                            </div>

                            <label htmlFor="confirmePassword">Confirm password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmePassword" name="confirmePassword"
                                    className="password-field"
                                    placeholder="Password"
                                />
                                <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VscEyeClosed /> : <VscEye />}
                                </span>
                            </div>

                            <button type="submit" className="submit-btn">Update password</button>

                        </form>
                    ):(
                        <>
                            <form onSubmit={(e) => {
                                setPass(true)
                                // check_code(e)
                                }}>
                                <button onClick={() => {send_code()}}>Send mail verification</button>
                                <p id={`alert-container`}></p>

                                <input
                                    type={`text`}
                                    id={`code`} name={`code`}
                                    placeholder={`Your Code`}
                                    required/>
                                <button type={`submit`}>Valid</button>
                            </form>
                        </>
                    )}

                </div>
            </div>

            <div className={`Navbar-policy`}>
                <Link to="/TermsAndPrivacy">
                Privacy policy
                </Link>

                <Link to="/TermsAndPrivacy">
                Terms of Use
                </Link>
            </div>
        </section>
    );
}

