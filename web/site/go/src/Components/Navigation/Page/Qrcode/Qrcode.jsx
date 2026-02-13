import "./Qrcode.css";
import { useState } from "react";

export default function Qrcode() {
  const [qrImage, setQrImage] = useState(null); // state pour stocker l'image

  const Qrbutton = async () => {
    console.log("Qrbutton clicked");
    try {
      const rep = await fetch("/api/qrimage", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const repp = await rep.json();

      if (repp.success) {
        console.log("QR code generated successfully:", repp.message);
        setQrImage(repp.message); // on stocke l'image dans le state
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  // const sendmail = async () => {
  //   console.log("sendmail clicked");
  //   try {
  //     const rep = await fetch("/api/sendmail", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //     });

  //     const repp = await rep.json();

  //     if (repp.success) {
  //       console.log("Verification email sent successfully:", repp.message);
  //     }
  //   } catch (error) {
  //     console.error("Error sending verification email:", error);
  //   }
  // };

  return (
    <>
      <button type="button" onClick={Qrbutton}>
        Générer QR code
      </button>
      <div id="qrcode">
        {qrImage && <img src={qrImage} alt="QR Code" />}
        <form action="/api/verify2fa" method="POST">
          <input type="text" name="code" placeholder="Enter 2FA code" required />
          <button type="submit">Verify 2FA</button>
        </form>
      </div>
{/* 
      <button type="button" onClick={sendmail}>
        Envoyer mail verification
      </button> */}
    </>
  );
}

