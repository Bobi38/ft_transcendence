import "./TermsAndPrivacy.scss"

const data = [
  {
    title: "Privacy Policy",
    lastUpdated: "April 2, 2026",
    articles:
	[
      { subtitle: "Information We Collect", content: "We collect personal information such as name, email, and browsing data." },
      { subtitle: "Use of Data", content: "The data is used to improve the service and communicate with users." },
      { subtitle: "Data Sharing", content: "We do not sell your data. It may be shared with service providers." },
      { subtitle: "Cookies", content: "We use cookies to improve the user experience." },
      { subtitle: "Security", content: "We protect your data with appropriate security measures." },
      {
        subtitle: "Your Rights",
        content: "You can access, modify, or delete your data.</br>Only by sending a request via LinkedIn profiles in the \"Contact Us\" section.",
      },
      { subtitle: "Changes", content: "This policy may be updated at any time." },
    ]
  },
  {
    title: "Terms of Service",
    lastUpdated: "April 2, 2026",
    articles:
	[
      { subtitle: "Use of the Service", content: "You agree to use the service in a lawful manner." },
      { subtitle: "Accounts", content: "You are responsible for your account and your credentials." },
      { subtitle: "Intellectual Property", content: "The content of the website is protected by intellectual property rights." },
      { subtitle: "Limitation of Liability", content: "We do not guarantee uninterrupted or error-free service." },
      { subtitle: "Termination", content: "We may suspend an account in case of violation of the rules." },
      { subtitle: "Changes", content: "These terms may be modified at any time." },
      { subtitle: "Governing Law", content: "Local laws apply." },
    ]
  }
];

export default function TermsAndPrivacy() {
	return (
		<div className="Term-root">
		<h1>Privacy Policy & Terms of Service</h1>
		<hr />
		{data.map((section, sec_id) => (
			<>
				<section key={sec_id}>
					<h2>{section.title}</h2>
					<p>Last updated: {section.lastUpdated}</p>

					{section.articles.map((article, art_id) => (
						<article key={art_id}>
						<h3>{art_id + 1}. {article.subtitle}</h3>
						<p>{article.content}</p>
						</article>
					))}
				</section>
				<hr />
			</>
		))}
		</div>
	);
}