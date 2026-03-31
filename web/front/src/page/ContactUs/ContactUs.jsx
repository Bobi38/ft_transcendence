/* extern */

/* back */

/* Css */
import "./ContactUs.scss";

/* Components */
import ContactCard from "./ContactCard/ContactCard";

const teamMembers = [
    { name: "Membre 0" },
    {
        name: "Florent Cretin",
        git: { url: "https://github.com/Lzozoflo", name: "LzozoFlo" },
        linkedin: { url: "https://www.linkedin.com/in/florent-cretin-8b5b9021a/", name: "Florent Cretin" },
        intraUrl: "https://profile.intra.42.fr/users/fcretin",
        image: "https://cdn.discordapp.com/avatars/229667943187873792/2e59c0303f5fd3dbfed52d3695dccab2.webp?size=160"
    },
    { name: "Membre 2" },
    { name: "Membre 3" },
    { name: "Membre 42" }
];

export default function ContactUs() {

    return (
        <section className={`ContactUs-root`}>

            <h1>Contact us !</h1>
			<section className="cardContainer">
				{teamMembers.map((member, index) => (
					<ContactCard key={index} {...member} />
				))}
			</section>
        </section>
    );

}
