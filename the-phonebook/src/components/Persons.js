import React from "react";
import Person from "./Person";

const Persons = ({ searchResult, handleRemove }) => {
  return (
    <>
      {" "}
      {searchResult.map((person, index) => {
        return (
          <Person person={person} key={index} handleRemove={handleRemove} />
        );
      })}{" "}
    </>
  );
};

export default Persons;
