import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";

const getPersons = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const addPerson = (person) => {
  const request = axios.post(baseUrl, person);
  return request.then((response) => response.data);
};

const removePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const updatePerson = (id, person) => {
  console.log(id);
  const request = axios.put(`${baseUrl}/${id}`, person);
  return request.then((response) => response.data);
};
export default {
  getPersons,
  addPerson,
  removePerson,
  updatePerson,
};
