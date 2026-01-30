import "./Profil.css";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
    
export default function Profil() {
    const navigate = useNavigate();
    const [nam, setNam] = useState("");
    const [nbvic, setNbvic] = useState(0);
    const [nbplay, setNbplay] = useState(0);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/getprofile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          setNam(result.name);
          setNbvic(result.nbvic);
          setNbplay(result.nbplay);
        } else {
          console.log("Erreur profil");
        }
      } catch (error) {
        console.error("Server error", error);
      }
    }

    fetchProfile();
  }, []); // 👈 très important

    return (
        <>
        <div>
            <p>NOM: {nam}</p>
            <br></br>
            <p> NOMBRE DE VICTOIRE: {nbvic}</p>
            <br></br>
            <p>NOMBRE PARTIES JOUE: {nbplay}</p>
        </div>
        <div>
            <button type="button" onClick={() => navigate("/Home")}>RETOUR</button>
        </div>
        </>
    )
}
