/* Css */
import "./AddressAutocomplete.scss";

/* Components */
import { useState } from "react";

    
export default function AddressAutocomplete({user, setUser}) {


  const [results, setResults] = useState([]);

  const handle_change = async (e) => {

      setUser({ ...user, location: e.target.value }) 
      const value = e.target.value;

      if (value.length > 3) {
          const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${value}`);

          const data = await res.json();
          setResults(data.features);
      } else {
          setResults([]);
      }
  };

  const handle_select = (address) => {
    setUser({...user, location: address})
    setResults([]);
  };

  return (
        <>
            <div>

                <input type={`text`} id={`location`} name={`location`}
                       value={user.location} onChange={handle_change}
                       placeholder={`Entrez votre adresse`}/>

                {!results && 

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
        </>
    );
}
