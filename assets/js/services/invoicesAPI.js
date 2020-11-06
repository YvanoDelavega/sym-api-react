import axios from "axios";

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

function find(id) {
  console.log("fetching");
  const data = axios
    .get("https://localhost:8000/api/invoices/" + id)
    .then((response) => response.data);
  return data;
}

function update(id, invoice) {
  return axios.put("https://localhost:8000/api/invoices/" + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}

function create(invoice) {
  return axios.post("https://localhost:8000/api/invoices", {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}

export default {
  //idem que findAll: findAll
  findAll,
  delete: deleteInvoice,
  update,
  find,
  create,
};
