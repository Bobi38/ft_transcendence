/* Css */
import "../../Navigation.css"
import "./ContactUs.css";
import ContactIcone from "./ContactIcone/ContactIcone";
import ContactIssue from "./ContactIssue/ContactIssue";


export default function ContactUs() {

    return (
        <>
            <div className={`full ContactUs-root ContactUs-root_bg`}>

                <h1>Contacter Nous</h1>
                <ContactIcone grid_style="center iconecolor"
                              name={undefined}
                              git={undefined}
                              linkedin={undefined}
                              intraUrl={undefined}
                              />

                              
                <ContactIcone grid_style="center iconecolor"
                              name={undefined}
                              git={undefined}
                              linkedin={undefined}
                              intraUrl={undefined}
                              />

                              
                <ContactIcone grid_style="center iconecolor"
                              name="Florent Cretin"
                              git={{ url: "https://github.com/Lzozoflo", name: "LzozoFlo" }}
                              linkedin={{ url: "https://www.linkedin.com/in/florent-cretin-8b5b9021a/", name: "Florent Cretin"  }} 
                              intraUrl={"https://profile.intra.42.fr/users/fcretin"}
                              />

                              
                <ContactIcone grid_style="center iconecolor"
                              name={undefined}
                              git={undefined}
                              linkedin={undefined}
                              intraUrl={undefined}
                              />

                              
                <ContactIcone grid_style="center iconecolor"
                              name={undefined}
                              git={undefined}
                              linkedin={undefined}
                              intraUrl={undefined}
                              />

                <h2>Issue</h2>
                <ContactIssue grid_style="iconecolor"
                              />

            </div>
        </>
    )
}
