/* Css */
import "./ContactCardDisplay.scss";

/* Components */
import ContactCard from "./ContactCard/ContactCard";
    
export default function ContactCardDisplay() {

    
    return (
        <>

            <div className={`ContactCardDisplay-root`}>

                <ContactCard parent_style={`ContactCardDisplay-div1`}
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            image={undefined}
                            />

                            
                <ContactCard parent_style={`ContactCardDisplay-div2`}
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            image={undefined}
                            />

                            
                <ContactCard parent_style={`ContactCardDisplay-div3`}
                            name="Florent Cretin"
                            git={{ url: "https://github.com/Lzozoflo", name: "LzozoFlo" }}
                            linkedin={{ url: "https://www.linkedin.com/in/florent-cretin-8b5b9021a/", name: "Florent Cretin"  }} 
                            intraUrl={"https://profile.intra.42.fr/users/fcretin"}
                            image="https://cdn.discordapp.com/avatars/229667943187873792/2e59c0303f5fd3dbfed52d3695dccab2.webp?size=160"
                            />

                            
                <ContactCard parent_style={`ContactCardDisplay-div4`}
                            name={undefined}
                            git={undefined}
                            linkedin={undefined}
                            intraUrl={undefined}
                            image={undefined}
                            />

                            
                <ContactCard parent_style={`ContactCardDisplay-div5`}
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
