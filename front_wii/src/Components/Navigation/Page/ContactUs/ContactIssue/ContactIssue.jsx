/* Css */
import "./ContactIssue.css";
    
export default function ContactIssue({ grid_style }) {
    return (
        <>
            <div className={`${grid_style} ContactIssue`}>
                <form className="full ContactIssue-form">

                    <div>
                        <label for="name">Noms</label>
                            <input type="text" id="name"/>
                    </div>

                    {/* <div> */}
                        <label for="mail">Email</label>
                            <input type="email" id="mail"/>
                    {/* </div> */}

                    {/* <div> */}
                        <label for="issue-type">Type issue</label>
                            <select name="issue-type" id="type-selected">
                                <option value="">--Veuillez choisir une option--</option>
                                <option value="bug">Bug</option>
                                <option value="bug-a-fix">Bug-a-fix</option>
                                <option value="bug-osef">Bug-osef</option>
                                <option value="ah-cest-la-merde">Ah c'est la merde</option>
                            </select>
                    {/* </div> */}

                    {/* <div> */}
                        <label for="story">Issue</label>
                            <textarea id="story" name="story" rows="5" cols="33"/>
                    {/* </div> */}
                    <input type="submit"/>
                </form>
            </div>
        </>
    )
}
