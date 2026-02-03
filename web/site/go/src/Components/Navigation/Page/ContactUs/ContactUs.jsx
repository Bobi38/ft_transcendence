/* Css */
import "../../Navigation.css"
import "./ContactUs.css";
import ContactIcone from "./ContactIcone/ContactIcone";
import ContactIssue from "./ContactIssue/ContactIssue";


export default function ContactUs() {
    return (
        <>
            <div className="full ContactUs-grid ContactUs-grid-padding">

                <ContactIcone grid_style="ContactUs-div1 center iconecolor ContactUs-iconemargin"
                              name={undefined}
                              git={undefined}
                              linkedin={undefined}
                              intraUrl={undefined}
                              />

                              
                <ContactIcone grid_style="ContactUs-div2 center iconecolor ContactUs-iconemargin"
                              name={undefined}
                              git={undefined}
                              linkedin={undefined}
                              intraUrl={undefined}
                              />

                              
                <ContactIcone grid_style="ContactUs-div3 center iconecolor ContactUs-iconemargin"
                              name="Florent Cretin"
                              git={{ url: "https://github.com/Lzozoflo", name: "LzozoFlo" }}
                              linkedin={{ url: "https://www.linkedin.com/in/florent-cretin-8b5b9021a/", name: "Florent Cretin"  }} 
                              intraUrl={"https://profile.intra.42.fr/users/fcretin"}
                              />

                              
                <ContactIcone grid_style="ContactUs-div4 center iconecolor ContactUs-iconemargin"
                              name={undefined}
                              git={undefined}
                              linkedin={undefined}
                              intraUrl={undefined}
                              />

                              
                <ContactIcone grid_style="ContactUs-div5 center iconecolor ContactUs-iconemargin"
                              name={undefined}
                              git={undefined}
                              linkedin={undefined}
                              intraUrl={undefined}
                              />

                <ContactIssue grid_style="ContactUs-div6 iconecolor "
                              />

            </div>
        </>
    )
}
