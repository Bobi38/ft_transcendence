/* Css */
import "./ContactIssue.css";
    
export default function ContactIssue({ grid_style }) {
    return (
        <>
            <div className={`${grid_style} ContactIssue`}>
                <form className="full ContactIssue-form">

                    <label htmlFor="name">Noms</label>
                        <input type="text" id="name"/>


                    <label htmlFor="mail">Email</label>
                        <input type="email" id="mail"/>


                    <label htmlFor="issue-type">Type issue</label>
                        <select name="issue-type" id="type-selected">
                            <option value="">--Veuillez choisir une option--</option>
                            <option value="bug">Bug</option>
                            <option value="bug-a-fix">Bug-a-fix</option>
                            <option value="bug-osef">Bug-osef</option>
                            <option value="ah-cest-la-merde">Ah c'est la merde</option>
                        </select>

                    <label htmlFor="story">Issue</label>
                        <textarea id="story" name="story" rows="10" cols="33"/>

                    <input type="submit"/>
                </form>
            </div>
        </>
    )
}
