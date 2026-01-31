import "./NavBar.css";
    
export default function NavBar({changePage}) {
    return (
        <>
            <button onClick={() => changePage("Home")}>
            home
            </button>
            
            <button onClick={() => changePage("Home")}>
            oui
            </button>
            
            <button onClick={() => changePage("Home")}>
non
            </button>
        </>
    )
}
