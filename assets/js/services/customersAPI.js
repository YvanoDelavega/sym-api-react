import axios from 'axios'

function findAll() {
     return axios
       .get("https://localhost:8000/api/customers")
       .then((reponse) => reponse.data["hydra:member"])
       .catch((error) => console.log(error.response));
}

function deleteCustomer(id) {
     return axios
       .delete("https://localhost:8000/api/customerls/" + id)
       .then((reponse) => reponse.data["hydra:member"]);
      // .catch((error) => console.log("erreur delete :" + error.response));
}



export default {
  //idem que findAll: findAll
  findAll,
  delete: deleteCustomer,
};