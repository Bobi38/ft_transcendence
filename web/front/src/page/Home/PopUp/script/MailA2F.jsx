/* Css */
import "FRONT/page/Home/PopUp/PopUp.scss";


/* Components */
import { useState } from "react";
import { AUTH } from "../../Home.jsx"

export default function MailA2F({setShowLog}) {

    const [showCodeInput, setShowCodeInput] = useState(false);

    const sendmail = async () => {

        console.log("sendmail(1) called");
        try {
          const rep = await fetch("/api/sendmail", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          console.log("sendmail(2) Response received:", rep);

          const repjson = await rep.json();
          console.log("json parsed:", repjson);
          if (repjson.success) {

            console.log("sendmail(3) Verification email sent successfully:", repjson.message);
            setShowCodeInput(true);

          } else {

            console.log("sendmail(4) Error sending verification email");

          }
        } catch (error) {
          console.error("sendmail(5) Error sending verification email:", error);
        }
    };

  const veryfCode = async (e) => {
    console.log("veryfCode(1) called");
    e.preventDefault();
    const formData = new FormData(e.target);
    const code = formData.get("code");


    try{
      const rep = await fetch("/api/verifCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({code}),
      })

      console.log("veryfCode(2) Response received:", rep);
      const repjson = await rep.json();
      if (repjson.success){

        console.log("veryfCode(3) 2FA successfully verified");
        setShowLog(AUTH.NONE);

      } else {

        console.log("veryfCode(4) 2FA failed:", repjson.message);

      }
    }catch(error){
      console.log("veryfCode(4) 2FA failed:", error);
    }
  }

    return (
        <>

            {!showCodeInput && (
                <button type="button" id={`mailverif`} className={``} onClick={sendmail}>
                  Envoyer mail de verification
                </button>
            )}

            {showCodeInput && (

              <form id={`maila2f`} className={``} onSubmit={veryfCode}>

                <input type="text" id="code" name="code" placeholder="Entrez Code"/>

                  <div className={`button-container`}>
                      <button type="submit" className={``}>Valider</button>
                      <button type="button" className={``} onClick={sendmail}>Renvoyer un mail de verification</button>
                  </div>
              </form>

            )}
      </>
  );
}
