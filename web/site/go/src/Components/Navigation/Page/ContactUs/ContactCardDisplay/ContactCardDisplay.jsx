/* Css */
import "./ContactCardDisplay.css";

/* Components */
import ContactIcone from "./ContactIcone/ContactIcone";
    
export default function ContactCardDisplay({ grid_style }) {

    
    return (
        <>

            <div className={`${grid_style} ContactCardDisplay-root `}>

                <ContactIcone grid_style="ContactCardDisplay-div1 center iconecolor"
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            />

                            
                <ContactIcone grid_style="ContactCardDisplay-div2 center iconecolor"
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            />

                            
                <ContactIcone grid_style="ContactCardDisplay-div3 center iconecolor"
                            name="Florent Cretin"
                            git={{ url: "https://github.com/Lzozoflo", name: "LzozoFlo" }}
                            linkedin={{ url: "https://www.linkedin.com/in/florent-cretin-8b5b9021a/", name: "Florent Cretin"  }} 
                            intraUrl={"https://profile.intra.42.fr/users/fcretin"}
                            />

                            
                <ContactIcone grid_style="ContactCardDisplay-div4 center iconecolor"
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            />

                            
                <ContactIcone grid_style="ContactCardDisplay-div5 center iconecolor"
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            />

            </div>
        </>
    )
}
