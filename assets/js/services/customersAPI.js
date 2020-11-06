import axios from "axios";

function findAll() {
  return axios
    .get("https://localhost:8000/api/customers")
    .then((reponse) => reponse.data["hydra:member"]);
  // ne pas faire ca ici sinon ca va faire planter la page qui appelle, s'il y a une erreur
  //  .catch((error) => console.log(error.response));
}

function deleteCustomer(id) {
  return axios
    .delete("https://localhost:8000/api/customers/" + id)
    .then((reponse) => reponse.data["hydra:member"]);
  // .catch((error) => console.log("erreur delete :" + error.response));
}

function find(id) {
  console.log("fetching");
  const data = axios
    .get("https://localhost:8000/api/customers/" + id)
    .then((response) => response.data);
  console.log(data);
  return data;
}

function update(id, customer) {
  return axios.put("https://localhost:8000/api/customers/" + id, customer);
}

function create(customer) {
  return axios.post("https://localhost:8000/api/customers", customer);
}

export default {
  //idem que findAll: findAll
  findAll,
  delete: deleteCustomer,
  find,
  update,
};
