/* Css */
import "./AddressAutocomplete.css";

/* Components */
import { useState } from "react";

    
export default function AddressAutocomplete({user, setUser}) {
  const [query, setQuery] = useState(user.location);
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 3) {
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${value}`
      );
      const data = await res.json();
      setResults(data.features);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (address) => {
    setUser({...user, location: address})
    setQuery(address);   // met la valeur dans l'input
    setResults([]);      // cache la liste
  };

  return (
    <div>
      <input
        type="text"
        id="location"
        name="location"
        value={query}
        onChange={handleChange}
        placeholder="Entrez votre adresse"
      />

      <ul>
        {results.map((item) => (
          <li
            key={item.properties.id}
            onClick={() => handleSelect(item.properties.label)}
            style={{ cursor: "pointer" }}
            className="AddressAutocomplete-list-item"
          >
            {item.properties.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
