/* Css */
import "./ContactUs.scss";

/* Components */
import ContactCardDisplay   from "./ContactCardDisplay/ContactCardDisplay";
import ContactIssue         from "./ContactIssue/ContactIssue";

export default function ContactUs() {

    return (
        <>
            <div className={``}>

                <div>
                    <h1>Contacter Nous</h1>
                </div>

                <ContactCardDisplay parent_style={`full ContactUs-padding`}/>

                <div>
                    <h2>Issue</h2>
                </div>

                <ContactIssue parent_style="iconecolor"/>

            </div>
        </>
    )
}
