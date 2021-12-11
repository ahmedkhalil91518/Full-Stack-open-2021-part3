import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phoneNumbers from "./services/phoneNumbers";
import Message from "./components/message";
import "./App.css";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [message, setMessage] = useState(null);
  const [errorOrNot, setErrorOrNot] = useState(false);
  useEffect(() => {
    phoneNumbers.getPersons().then((res) => {
      setPersons(res);
    });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    let exists = false;
    let id;
    for (let i = 0; i < persons.length; i++) {
      if (persons[i].name === newName) {
        exists = true;
        id = persons[i].id;
      }
    }
    if (exists) {
      const confirmReplace = window.confirm(
        `${newName} is already added to phone book, replace the old number with the new one?`
      );
      if (confirmReplace) {
        console.log(id);
        phoneNumbers
          .updatePerson(id, { name: newName, number: newNumber })
          .then((x) => {
            setMessage(`${newName} is updated to phone book`);
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          })
          .catch((error) => {
            console.log(error.response.data);
            setMessage(error.response.data);
            setErrorOrNot(true);
            setTimeout(() => {
              setMessage(null);
              setErrorOrNot(false);
            }, 3000);
          });
        phoneNumbers.getPersons().then((res) => {
          setPersons(res);
        });
      }
    } else {
      phoneNumbers
        .addPerson({ name: newName, number: newNumber })
        .then((res) => {
          phoneNumbers.getPersons().then((res) => {
            setPersons(res);
            setNewName("");
            setNewNumber("");
            setMessage(`${newName} is added to phone book`);
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          });
        })
        .catch((error) => {
          console.log(error.response.data);
          setMessage(error.response.data);
          setErrorOrNot(true);
          setTimeout(() => {
            setMessage(null);
            setErrorOrNot(false);
          }, 3000);
        });
    }
    setSearch("");
  };
  const handleChangeName = (e) => {
    setNewName(e.target.value);
  };
  const handleChangeNumber = (e) => {
    setNewNumber(e.target.value);
  };
  useEffect(() => {
    console.log(persons);
    setSearchResult(
      persons.filter((x) => {
        return x.name.toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [persons, search]);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleRemove = (person) => () => {
    const confirmDelete = window.confirm(
      `are you sure you want delete ${person.name}`
    );

    if (confirmDelete) {
      console.log(person.id);
      phoneNumbers.removePerson(person.id);
    }
    phoneNumbers.getPersons().then((res) => {
      setPersons(res);
    });
  };
  return (
    <div>
      <div>
        <h2>Phonebook</h2>
        <Message message={message} errorOrNot={errorOrNot} />
        <Filter handleSearch={handleSearch} search={search} />
        <h3>Add a new</h3>
        <PersonForm
          handleSubmit={handleSubmit}
          handleChangeName={handleChangeName}
          newName={newName}
          handleChangeNumber={handleChangeNumber}
          newNumber={newNumber}
        />
        <h3>Numbers</h3>
        <Persons searchResult={searchResult} handleRemove={handleRemove} />
      </div>
    </div>
  );
};

export default App;
