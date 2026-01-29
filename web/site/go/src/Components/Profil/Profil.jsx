import "./Profil.css";
    
export default function Profil() {
    try{
        const reponse = await fetch('/api/get')
    }
    return (
        <>
        <div>
            <p>NOM: {name}</p>
            <br></br>
            <p> NOMBRE DE VICTOIRE: {nbvic}</p>
            <br></br>
            <p>NOMBRE PARTIES JOUE: {nbplay}</p>
        </div>
        </>
    )
}
