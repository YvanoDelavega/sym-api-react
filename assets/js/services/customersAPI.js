import axios from "axios";
import { CUSTOMERS_API, CUSTOMERS_APISLASH } from "./config";

function findAll() {
  return axios
    .get(CUSTOMERS_API)
    .then((reponse) => reponse.data["hydra:member"]);
  // ne pas faire ca ici sinon ca va faire planter la page qui appelle, s'il y a une erreur
  //  .catch((error) => console.log(error.response));
}

function deleteCustomer(id) {
  return axios
    .delete(CUSTOMERS_APISLASH + id)
    .then((reponse) => reponse.data["hydra:member"]);
  // .catch((error) => console.log("erreur delete :" + error.response));
}

function find(id) {
  console.log("fetching");
  const data = axios
    .get(CUSTOMERS_APISLASH + id)
    .then((response) => response.data);
  console.log(data);
  return data;
}

function update(id, customer) {
  return axios.put(CUSTOMERS_APISLASH + id, customer);
}

function create(customer) {
  return axios.post(CUSTOMERS_API, customer);
}

export default {
  //idem que findAll: findAll
  findAll,
  delete: deleteCustomer,
  find,
  update,
  create,
};
