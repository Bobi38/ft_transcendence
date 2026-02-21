/* Css */
import "FRONT/page/Home/PopUp/PopUp.scss";


/* Components */
import { useState } from "react";
import { AUTH } from "../../Home.jsx"

export default function MailA2F({setShowLog}) {

    const [showCodeInput, setShowCodeInput] = useState(false);

    const maila2f_send_mail = async () => {

        console.log("maila2f_send_mail(1) called");
        try {
          const rep = await fetch("/api/send_mail", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          console.log("maila2f_send_mail(2) Response received:", rep);

          const repjson = await rep.json();
          console.log("json parsed:", repjson);
          if (repjson.success) {

            console.log("maila2f_send_mail(3) Verification email sent successfully:", repjson.message);
            setShowCodeInput(true);

          } else {

            console.log("maila2f_send_mail(4) Error sending verification email");

          }
        } catch (error) {
          console.error("maila2f_send_mail(5) Error sending verification email:", error);
        }
    };

  const maila2f_check_code = async (e) => {

    console.log("maila2f_check_code(1) called");
    e.preventDefault();
    const formData = new FormData(e.target);
    const code = formData.get("code");


    try{
      const rep = await fetch("/api/maila2f_check_code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({code}),
      })

      console.log("maila2f_check_code(2) Response received:", rep);
      const repjson = await rep.json();
      if (repjson.success){

        console.log("maila2f_check_code(3) 2FA successfully verified");
        setShowLog(AUTH.NONE);

      } else {

        console.log("maila2f_check_code(4) 2FA failed:", repjson.message);

      }
    }catch(error){
      console.log("maila2f_check_code(4) 2FA failed:", error);
    }
  }

    return (
        <>

            {!showCodeInput && (
                <button type={`button`} id={`mailverif`} className={``} onClick={maila2f_send_mail}>
                  Envoyer mail de verification
                </button>
            )}

            {showCodeInput && (

              <form id={`maila2f`} className={``} onSubmit={maila2f_check_code}>

                <input type={`text`} id={`code`} name={`code`} placeholder={`Entrez Code`}/>

                  <div className={`button-container`}>
                      <button type={`submit`} className={``}>Valider</button>
                      <button type={`button`} className={``} onClick={maila2f_send_mail}>Renvoyer un mail de verification</button>
                  </div>
              </form>

            )}
      </>
  );
}
