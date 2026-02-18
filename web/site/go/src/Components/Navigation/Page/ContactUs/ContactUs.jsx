/* Css */
import "../../Navigation.scss"
import "./ContactUs.scss";

/* Components */
import ContactCardDisplay from "./ContactCardDisplay/ContactCardDisplay";
import ContactIssue from "./ContactIssue/ContactIssue";

export default function ContactUs() {

    return (
        <>
            <div className={`fullw ContactUs-bg`}>

                <div>
                    <h1>Contacter Nous</h1>
                </div>

                <ContactCardDisplay grid_style={`full ContactUs-padding`}/>

                <div>
                    <h2>Issue</h2>
                </div>

                <ContactIssue grid_style="iconecolor"/>

            </div>
        </>
    )
}
