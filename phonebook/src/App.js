import React, { useState, useEffect } from "react";
import "./App.css";
import phonebookServices from "./services/phonebook";
// Components
const Notification = ({ successMessage = null, failureMessage = null }) => {
  const successStyle = {
    color: "green",
  };
  const failureStyle = {
    color: "red",
  };
  // If there is a failure message
  if (failureMessage !== null) {
    return (
      <div className="notification" style={failureStyle}>
        {failureMessage}
      </div>
    );
  }
  // If there is a success message
  if (successMessage !== null) {
    return (
      <div className="notification" style={successStyle}>
        {successMessage}
      </div>
    );
  }
  return null;
};

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
  const [successMessage, setSuccessMessage] = useState(null);
  const [failureMessage, setFailureMessage] = useState(null);

  // Effects
  useEffect(() => {
    phonebookServices.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  // Submitting the form to add a new person to the phonebook
  const addNewPerson = (event) => {
    event.preventDefault();

    // If the person's name is already in the phonebook
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
        phonebookServices
          .updatePerson(person)
          .then((response) => {
            setPersons(persons.map((p) => (p.id !== person.id ? p : person)));
            setSuccessMessage(
              `${response.data.name}'s number has been changed`
            );
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
            setNewName("");
            setNewPhoneNumber("");
          })
          .catch((error) => {
            setPersons(persons.filter((p) => person.id !== p.id));
            setFailureMessage(
              `${person.name} has already been deleted from the server`
            );
            setTimeout(() => {
              setFailureMessage(null);
            }, 5000);
          });
      }
      return;
    }

    // Actually adding a new name and phonenumber to the phonebook
    const newPerson = { name: newName, number: newPhoneNumber };
    phonebookServices.addPerson(newPerson).then(({ data }) => {
      setPersons([...persons, data]);
      setSuccessMessage(`${newPerson.name} has been added to the phonebook`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
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
      <Notification
        successMessage={successMessage}
        failureMessage={failureMessage}
      />
    </div>
  );
};

export default App;
