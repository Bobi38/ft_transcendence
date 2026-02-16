import "./Qrcode.css";
import { useState } from "react";

export default function Qrcode() {
  // const [qrImage, setQrImage] = useState(null); // state pour stocker l'image
  const [showCodeInput, setShowCodeInput] = useState(false);

  // const Qrbutton = async () => {
  //   console.log("Qrbutton clicked");
  //   try {
  //     const rep = await fetch("/api/qrimage", {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //     });

  //     const repp = await rep.json();

  //     if (repp.success) {
  //       console.log("QR code generated successfully:", repp.message);
  //       setQrImage(repp.message); // on stocke l'image dans le state
  //     }
  //   } catch (error) {
  //     console.error("Error generating QR code:", error);
  //   }
  // };

  const sendmail = async () => {
    console.log("sendmail clicked");
    try {
      const rep = await fetch("/api/sendmail", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const repp = await rep.json();
      console.log("je suis apres");
      if (repp.success) {
        console.log("Verification email sent successfully:", repp.message);
        setShowCodeInput(true);
      }
      else{
        console.log("error ", repp.message);
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };

  const veryfCode = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const code = formData.get("code");

    try{
      const rep = await fetch("/api/verifCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: code,
      })

      const repp = await rep.json();
      if (repp.success)
        console.log("COOOOOOOL 2FA VALID");
      else
        console.log("erro 2FA " , repp.message);
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

      {/* <button type="button" onClick={Qrbutton}>
        Générer QR code
      </button>
      <div id="qrcode">
        {qrImage && <img src={qrImage} alt="QR Code" />}
        <form action="/api/verify2fa" method="POST">
          <input type="text" name="code" placeholder="Enter 2FA code" required />
          <button type="submit">Verify 2FA</button>
        </form>
      </div> */}