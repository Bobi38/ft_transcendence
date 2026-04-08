/* Css */
import "./ContactUs.scss";

/* Components */
import ContactCard          from    "./ContactCard/ContactCard";

const teamMembers = [
	{
        name: "Titouan Voisin",
        git: { url: "https://github.com/Bobi38", name: "Bobi38" },
        linkedin: { url: "https://fr.linkedin.com/in/titouan-voisin", name: "Titouan Voisin" },
        intraUrl: "https://profile.intra.42.fr/users/tvoisin",
        image: "https://cdn.intra.42.fr/users/28ab25983990e3568ae2b5fcbcd2fb60/tvoisin.JPG"
    },
    {
        name: "Florent Cretin",
        git: { url: "https://github.com/LzozoFlo", name: "LzozoFlo" },
        linkedin: { url: "https://www.linkedin.com/in/florent-cretin-8b5b9021a/", name: "Florent Cretin" },
        intraUrl: "https://profile.intra.42.fr/users/fcretin",
        image: "https://cdn.intra.42.fr/users/51264ed5256b8a2c4567f366ce274f82/fcretin.JPG"
    },
    {
        name: "Nicolas Rochedy",
        git: { url: "https://github.com/ncls42", name: "ncls42" },
        linkedin: { url: "", name: "No linkedin" },
        intraUrl: "https://profile.intra.42.fr/users/niroched",
        image: "https://cdn.intra.42.fr/users/87bbcbd99801b2b375b4b5ebd110ee0e/niroched.JPG"
    },
	{
        name: "Solal Flechelles",
        git: { url: "https://github.com/sflechel", name: "sflechel" },
        linkedin: { url: "https://fr.linkedin.com/in/solal-flechelles", name: "Solal" },
        intraUrl: "https://profile.intra.42.fr/users/sflechel",
        image: "https://cdn.intra.42.fr/users/7b96333f8e88be0a14a22fe4ee726648/sflechel.JPG"
    },
	    {
        name: "Elevan Darnand",
        git: { url: "https://github.com/Corbiobio", name: "Corbiobio" },
        linkedin: { url: "https://fr.linkedin.com/in/elevan-darnand", name: "Elevan" },
        intraUrl: "https://profile.intra.42.fr/users/edarnand",
        image: "https://cdn.intra.42.fr/users/2117a758593e97415361993aadcf1837/edarnand.JPG"
    },
];

export default function ContactUs() {

    return (
        <section className={`ContactUs-root`}>
            <h1>Contact us !</h1>

			<hr />

			<div className="card-container">
				{teamMembers.map((member, index) => (
					<ContactCard key={index} {...member} />
				))}
			</div>
        </section>
    );

}
