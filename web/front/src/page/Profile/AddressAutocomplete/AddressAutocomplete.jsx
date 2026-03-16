/* extern */
import { useState } from "react";

/*back*/
// import { showAlert } from "BACK/fct1.js";

/* Css */
import "./AddressAutocomplete.scss";

/* Components */
import useFetch from "HOOKS/useFetch.jsx";

    
export default function AddressAutocomplete({user, setUser, isReadOnly}) {


    const [results, setResults] = useState([]);

    const handle_change = async (e) => {

        const value = e.target.value;
        setUser({ ...user, location: value }) 

        if (value.length > 3) {
            const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${value}`);

            const data = await res.json();
            setResults(data.features);
            console.log("results: ",results);

        } else {
            setResults([]);
        }
    };

    const handle_select = (address) => {
        setUser({...user, location: address})
        setResults([]);
    };

  return (
        <div className={`AddressAutocomplete-root`}>

            <input type={`text`} id={`location`} name={`location`}
                    value={user.location || ""} onChange={handle_change}
                    readOnly={isReadOnly}
                    placeholder={`Entrez votre adresse`}/>

            {results && 
                <div className={`AddressAutocomplete-list-item`}>
                    <ul>

                        {results.map((item) => (
                            <li key={item.properties.id}
                                onClick={() => handle_select(item.properties.label)}
                                style={{ cursor: "pointer" }}>
                                {item.properties.label}
                            </li>
                        ))}

                    </ul>
                </div>
            }


        </div>
    );
}
