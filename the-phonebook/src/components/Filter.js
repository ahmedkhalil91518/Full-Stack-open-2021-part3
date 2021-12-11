import React from "react";

const Filter = ({ handleSearch, search }) => {
  return (
    <div>
      filter shown with <input onChange={handleSearch} value={search} />
    </div>
  );
};

export default Filter;
