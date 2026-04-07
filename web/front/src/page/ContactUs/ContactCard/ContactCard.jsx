/* Css */
import "./ContactCard.scss";

/* Components */
import { FaGithub, FaLinkedin }     from    "react-icons/fa";
import { Si42 }                     from    "react-icons/si";
import Button                       from    "COMP/Button/Button.jsx"

export default function ContactCard({
		name = "default name",
		git = { url: "https://github.com", name: "GitHubqwerqwerqwerqwer" },
		linkedin = { url: "https://www.linkedin.com/", name: "LinkedIn" },
		intraUrl = "https://profile.intra.42.fr",
		image = "https://sevetys.fr/_next/image/?url=https%3A%2F%2Fcharming-angel-5ca83bf286.media.strapiapp.com%2FChat_europeen_573af6e71d.webp&w=3840&q=75"
	})
{
    return (
        <article className="ContactCard-root">
            <img className="ContactCard-image" src={image} alt={`Profil de ${name}`}/>
            <div className="ContactCard-info">
                <h2>{name}</h2>
                <Button path={git.url} targ="_blank"><FaGithub/><span>{git.name}</span></Button>
                <Button path={linkedin.url} targ="_blank"><FaLinkedin/><span>{linkedin.name}</span></Button>
                <Button path={intraUrl} targ="_blank"><Si42 /><span>Intra 42</span></Button>
            </div>
        </article>
    );
}
