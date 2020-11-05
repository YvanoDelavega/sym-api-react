import axios from 'axios'

function findAll() {
     return axios
       .get("https://localhost:8000/api/invoices")
       .then((reponse) => reponse.data["hydra:member"]);
}

function deleteInvoice(id) {
     return axios
       .delete("https://localhost:8000/api/invoices/" + id)
       .then((reponse) => reponse.data["hydra:member"]);
}

export default {
  //idem que findAll: findAll
  findAll,
  delete: deleteInvoice,
};