/* Css */
import "./ContactIssue.scss";

export default function ContactIssue() {
    return (
        <>
            <div className={`ContactIssue-root`}>

                <h4>Issue</h4>
                <form className={`ContactIssue-form`}>


                    <div>
                        <label htmlFor={`name`}>Noms</label>
                        <input type={`text`} id={`name`}/>
                    </div>


                    <div>
                        <label htmlFor={`mail`}>Email</label>
                        <input type={`email`} id={`mail`}/>
                    </div>


                    <div>
                        <label htmlFor={`issue-type`}>Type issue</label>
                        <select name={`issue-type`} id={`type-selected`}>
                            <option value={``}>--Veuillez choisir une option--</option>
                            <option value={`bug`}>Bug</option>
                            <option value={`bug-a-fix`}>Bug-a-fix</option>
                            <option value={`bug-osef`}>Bug-osef</option>
                            <option value={`ah-cest-la-merde`}>Ah c'est la merde</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor={`story`}>Issue</label>
                        <textarea id={`story`} name={`story`} rows={`10`} cols={`33`}/>
                    </div>

                        <input type={`submit`}/>
                </form>
            </div>
        </>
    )
}
