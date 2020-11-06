import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import customersAPI from "../services/customersAPI";
import invoicesAPI from "../services/invoicesAPI";

export const InvoicePage = ({ match, history }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id = "new" } = match.params;
  const [customers, setCustomers] = useState([]);
  
  const [invoice, setInvoice] = useState({
    customer: "",

    status: "SENT", // pour initialiser le cmap status
    amount: "",
  });

  const [errors, setErrors] = useState({
    customer: "",

    status: "",
    amount: "",
  });

  const fetchInvoice = async (id) => {
    try {
      const { customer, status, amount } = await invoicesAPI.find(id);
      console.log("fetchInvoice");
      console.log({ customer, status, amount });
      setInvoice({ customer: customer.id, status, amount });
    } catch (error) {
      console.log(error.response);
      history.replace("/invoices/");
    }
  };

  /**
   * renvoie la liste des customers
   */
  const fetchCustomers = async () => {
    try {
      console.log("fetchCustomers");
      const data = await customersAPI.findAll();
      setCustomers(data);

      // si pas de client, on en met un par défaut (sinon erreur qand on va commmiter)
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {        
      console.log(error.response);
      history.replace("/invoices/");
    }
  };

  // charge les customers la 1ere fois seulement
  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (id !== "new") {
      fetchInvoice(id);

      //fetchCustomers();
      setIsEditing(true);
    }
  }, [id]);


  const handleSearch = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      // so modification
      if (isEditing) {
          console.log("modification");
        console.log(invoice);
        const response = await invoicesAPI.update(id, invoice);
        // const response = await Axios.put(
        //   "https://localhost:8000/api/invoices/" + id,
        //   { ...invoice, customer: `/api/customers/${invoice.customer}` }
        // );
        console.log(response);        
        // creation
      } else {
        console.log("POST");
        console.log(invoice);
        const modif = {
          ...invoice,
          customer: `/api/customers/${invoice.customer}`,
        };
        console.log(modif);

        /*const response = await Axios.post(
          "https://localhost:8000/api/invoices",
          { ...invoice, customer: `/api/customers/${invoice.customer}` }
        );*/
        const response = await invoicesAPI.create(invoice);
        console.log("reponse");
        console.log(response);
        history.replace("/invoices");
      }
      setErrors({});
    } catch (error) {
        console.log("error");
         console.log(error);
      console.log(error.response);
      if (error.response.data.violations) {
        const submitErrors = [];
        error.response.data.violations.forEach(
          (v) => (submitErrors[v.propertyPath] = v.message)
        );
        setErrors(submitErrors);
      }
    }
  };

  return (
    <>
      {(!isEditing && <h1>Création d'une facture</h1>) || (
        <h1>Modification d'une facture</h1>
      )}

      <form onSubmit={handleSubmit}>
        {/* <Field
          name="customer"
          label="Client"
          onChange={handleSearch}
          value={invoice.customer}
          //  isrequired="required"
          error={errors.customer}
        /> */}
        {/* <Field
          name="sentAt"
          label="Date d'envoi"
          onChange={handleSearch}
          value={invoice.sentAt}
          //  isrequired="required"
          error={errors.sentAt}
        /> */}
        {/* <Field
          name="status"
          //type="email"
          label="Status"
          onChange={handleSearch}
          value={invoice.status}
          //   isrequired="required"
          error={errors.status}
        /> */}

        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleSearch}
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </Select>

        <Field
          name="amount"
          label="Montant"
          placeholder="Montant de la facture"
          type="number"
          onChange={handleSearch}
          value={invoice.amount}
          //   isrequired="required"
          error={errors.amount}
        />

        <Select
          name="status"
          label="Statut"
          value={invoice.status}
          error={errors.status}
          onChange={handleSearch}
        >
          <option value="SENT">Envoyé</option>
          <option value="PAID">Payé</option>
          <option value="CANCELLED">Annulé</option>
        </Select>

        <div className="form-group">
          <Link className="btn btn-danger mr-5" to="/invoices">
            retour
          </Link>
          <button type="submit" className="btn btn-success">
            {(!isEditing && "créer la facture") || "modifier la facture"}
          </button>
        </div>
      </form>
    </>
  );
};
