/* Css */
import "./Qrcode.css";


/* Components */
import { useState } from "react";

export default function Qrcode() {
  
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
      
      } else {

        console.log("veryfCode(4) 2FA failed:", repjson.message);
      
      }
    }catch(err){
      console.log(err);
    }
  }

  return (
    <>


      <button type="button" onClick={sendmail}>
        Envoyer mail verification
      </button>

      {showCodeInput && (

        <form onSubmit={veryfCode}>
          <input type= "text" placeholder="Entrez Code" name="code"/>
          <button type="submit">Valider</button>
        </form>
      
      )}
    </>
  );
}
