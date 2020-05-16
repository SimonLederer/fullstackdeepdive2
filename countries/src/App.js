import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import CountryDisplayer from "./components/CountryDisplayer";

const App = () => {
  // States
  const [countries, setCountries] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [countriesToDisplay, setCountriesToDisplay] = useState([]);
  // Effects
  useEffect(() => {
    // Get country data from restcountries.eu
    axios.get(`https://restcountries.eu/rest/v2/all`).then((response) => {
      setCountries(response.data);
    });
  }, []);

  // Event handlers
  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
    setCountriesToDisplay(
      countries.filter((country) => {
        return country.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      })
    );
  };
  return (
    <div>
      <input type="text" value={userInput} onChange={handleUserInputChange} />
      <CountryDisplayer
        countries={countriesToDisplay}
        setCountriesToDisplay={setCountriesToDisplay}
      />
    </div>
  );
};

export default App;
