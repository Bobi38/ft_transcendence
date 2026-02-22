/* Css */
import "./ContactUs.scss";

/* Components */
import ContactCardDisplay   from "./ContactCardDisplay/ContactCardDisplay";
import ContactIssue         from "./ContactIssue/ContactIssue";

export default function ContactUs() {

    return (
        <>
            <div className={`ContactUs-root`}>

                <h3>Contacter Nous</h3>

                <ContactCardDisplay/>
                <ContactIssue/>

            </div>
        </>
    )
}
