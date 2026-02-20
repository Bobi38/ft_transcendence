/* Css */
import "./ContactCardDisplay.scss";

/* Components */
import ContactIcone from "./ContactIcone/ContactIcone";
    
export default function ContactCardDisplay({ parent_style }) {

    
    return (
        <>

            <div className={`${parent_style} ContactCardDisplay-root `}>

                <ContactIcone parent_style="ContactCardDisplay-div1 center iconecolor"
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            image={undefined}
                            />

                            
                <ContactIcone parent_style="ContactCardDisplay-div2 center iconecolor"
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            image={undefined}
                            />

                            
                <ContactIcone parent_style="ContactCardDisplay-div3 center iconecolor"
                            name="Florent Cretin"
                            git={{ url: "https://github.com/Lzozoflo", name: "LzozoFlo" }}
                            linkedin={{ url: "https://www.linkedin.com/in/florent-cretin-8b5b9021a/", name: "Florent Cretin"  }} 
                            intraUrl={"https://profile.intra.42.fr/users/fcretin"}
                            image="https://cdn.discordapp.com/avatars/229667943187873792/2e59c0303f5fd3dbfed52d3695dccab2.webp?size=160"
                            />

                            
                <ContactIcone parent_style="ContactCardDisplay-div4 center iconecolor"
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            image={undefined}
                            />

                            
                <ContactIcone parent_style="ContactCardDisplay-div5 center iconecolor"
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            image={undefined}
                            />

            </div>
        </>
    )
}
