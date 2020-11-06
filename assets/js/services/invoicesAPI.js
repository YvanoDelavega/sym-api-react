import axios from "axios";
import { INVOICES_API, INVOICES_APISLASH } from "./config";

function findAll() {
  return axios
    .get(INVOICES_API)
    .then((reponse) => reponse.data["hydra:member"]);
}

function deleteInvoice(id) {
  return axios
    .delete(INVOICES_APISLASH + id)
    .then((reponse) => reponse.data["hydra:member"]);
}

function find(id) {
  console.log("fetching");
  const data = axios
    .get(INVOICES_APISLASH + id)
    .then((response) => response.data);
  return data;
}

function update(id, invoice) {
  return axios.put(INVOICES_APISLASH + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}

function create(invoice) {
  return axios.post(INVOICES_API, {
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
