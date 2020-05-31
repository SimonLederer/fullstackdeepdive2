import React, { useState, useEffect } from "react";
import "./App.css";
import phonebookServices from "./services/phonebook";
// Components
const Numbers = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map((person) => {
        return (
          <Contact
            person={person}
            key={person.id}
            deletePerson={deletePerson}
          />
        );
      })}
    </ul>
  );
};

const Contact = ({ person, deletePerson }) => {
  return (
    <li className="person">
      {person.name} {person.number}
      <button
        onClick={() => deletePerson(person)}
        style={{
          float: "right",
          marginRight: "3px",
          padding: "1px 10px",
          backgroundColor: "red",
        }}>
        &times;
      </button>
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
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [filterExpression, setFilterExpression] = useState("");

  // Effects
  useEffect(() => {
    phonebookServices.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  // Submitting the form
  const addNewPerson = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with the new one?`
        )
      ) {
        // Update db with new person's details
        const person = {
          ...persons.find((person) => person.name === newName),
          number: newPhoneNumber,
        };
        phonebookServices.updatePerson(person).then((response) => {
          setPersons(persons.map((p) => (p.id !== person.id ? p : person)));
          setNewName("");
          setNewPhoneNumber("");
        });
      }
      return;
    }
    const newPerson = { name: newName, number: newPhoneNumber };
    phonebookServices.addPerson(newPerson).then(({ data }) => {
      setPersons([...persons, data]);
    });
    setNewName("");
    setNewPhoneNumber("");
  };

  // Deleting users
  const deletePerson = (person) => {
    const { id } = person;
    if (window.confirm(`Are you sure you want to delete ${person.name}`)) {
      phonebookServices.deletePerson(id).then(({ data }) => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
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
      <Numbers persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
