import axios from "axios";
const baseURL = `http://localhost:3001/persons`;

const getAll = () => axios.get(baseURL);
const addPerson = (person) => axios.post(baseURL, person);
const deletePerson = (id) => axios.delete(`${baseURL}/${id}`);
const updatePerson = (person) => axios.put(`${baseURL}/${person.id}`, person);

export default {
  getAll,
  addPerson,
  deletePerson,
  updatePerson,
};
