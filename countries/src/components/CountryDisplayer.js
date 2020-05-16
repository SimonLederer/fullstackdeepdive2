import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherInfo = ({ country }) => {
  const [weatherInfo, setWeatherInfo] = useState({ returned: false });
  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY;
    const apiTemplate = `http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`;
    axios.get(apiTemplate).then((response) => {
      let responseInfo = response.data.current;
      responseInfo.returned = true;
      setWeatherInfo(response.data.current);
      console.log("sent weather info");
    });
  }, [country]);
  return weatherInfo.returned ? (
    <div>
      <h2>Weather in {country.name}</h2>
      <b>Temperature: </b>
      {weatherInfo.temperature} celcius
      <br />
      <img src={weatherInfo.weather_icons[0]} alt="" />
      <br />
      <b>Wind: </b>
      {weatherInfo.wind_speed}kph
      <br />
      <b>Direction: </b>
      {weatherInfo.wind_dir}
    </div>
  ) : (
    <div></div>
  );
};

const ExtraInfo = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <div>Capital: {country.capital}</div>
      <div>Population: {country.population}</div>
      <h2>Languages</h2>
      <ul>
        {country.languages.map((language) => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>
      <img className="flag" src={country.flag} alt={country.name} />
      <WeatherInfo country={country} />
    </div>
  );
};

const CountryDisplayer = ({ countries, setCountriesToDisplay }) => {
  const handleShow = (country) => {
    setCountriesToDisplay([country]);
  };
  if (countries.length >= 10) {
    return <div>Too many matches, specify another filter</div>;
  }
  if (countries.length === 0) {
    return <div>No country could be found with this filter</div>;
  }
  if (countries.length > 1) {
    return countries.map((country) => {
      return (
        <div key={country.name}>
          {country.name}{" "}
          <button onClick={() => handleShow(country)}>show</button>
        </div>
      );
    });
  }
  if (countries.length === 1) {
    return <ExtraInfo country={countries[0]} />;
  }
};

export default CountryDisplayer;
