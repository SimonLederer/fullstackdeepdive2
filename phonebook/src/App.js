import React, { useState } from "react";
import "./App.css";

// Components
const Numbers = ({ persons }) => {
  return (
    <ul>
      {persons.map((person) => {
        return <Contact person={person} key={person.name} />;
      })}
    </ul>
  );
};

const Contact = ({ person }) => {
  return (
    <li className="person">
      {person.name} {person.phoneNumber}
    </li>
  );
};

const FilterBar = ({ handleInputChange, filterExpression }) => {
  return (
    <input type="text" value={filterExpression} onChange={handleInputChange} />
  );
};

const PersonForm = ({
  addNewPersonHandler,
  newName,
  handleNameInputChange,
  newPhoneNumber,
  handlePhoneNumberInputChange,
}) => {
  return (
    <form onSubmit={addNewPersonHandler}>
      <div>
        Name:
        <input type="text" value={newName} onChange={handleNameInputChange} />
      </div>
      <div>
        Phone Number:
        <input
          type="text"
          value={newPhoneNumber}
          onChange={handlePhoneNumberInputChange}
        />
      </div>
      <button type="submit" className="btn">
        Add
      </button>
    </form>
  );
};

const App = () => {
  // States
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phoneNumber: "040-123456" },
    { name: "Ada Lovelace", phoneNumber: "39-44-5323523" },
    { name: "Dan Abramov", phoneNumber: "12-43-234345" },
    { name: "Mary Poppendieck", phoneNumber: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [filterExpression, setFilterExpression] = useState("");

  // Submitting the form
  const addNewPerson = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already in the phonebook`);
      return;
    }
    setPersons([...persons, { name: newName, phoneNumber: newPhoneNumber }]);
    setNewName("");
    setNewPhoneNumber("");
  };

  // Controlled input onChange handlers
  const handleNameInputChange = (event) => {
    setNewName(event.target.value);
  };
  const handlePhoneNumberInputChange = (event) => {
    setNewPhoneNumber(event.target.value);
  };
  const handleFilterInputChange = (event) => {
    setFilterExpression(event.target.value);
  };
  // Choosing what people to display based on filter expression
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filterExpression.toLowerCase())
  );
  // Render
  return (
    <div className="container">
      <h1>Phonebook</h1>
      <h2>Find Contact</h2>
      <FilterBar
        handleInputChange={handleFilterInputChange}
        filterExpression={filterExpression}
      />
      <h2>New Contact</h2>
      <PersonForm
        addNewPersonHandler={addNewPerson}
        newName={newName}
        handleNameInputChange={handleNameInputChange}
        newPhoneNumber={newPhoneNumber}
        handlePhoneNumberInputChange={handlePhoneNumberInputChange}
      />
      <h2>Numbers</h2>
      <Numbers persons={personsToShow} />
    </div>
  );
};

export default App;
