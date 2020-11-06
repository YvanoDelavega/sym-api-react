import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import customersAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id = "new" } = match.params;

  const fetchCustomer = async (id) => {
    try {
      //   const data = await customersAPI.find(id);
      //   const { firstName, lastName, company, email } = data;
      // s'écrit aussi :
      const { firstName, lastName, company, email } = await customersAPI.find(
        id
      );
      console.log({ firstName, lastName, company, email });
      setCustomer({ firstName, lastName, company, email });
    } catch (error) {
      console.log(error.response);
      history.replace("/customers/");
    }
  };

  useEffect(() => {
    if (id !== "new") {
      console.log("fetchCustomer " + id);
      fetchCustomer(id);
      setIsEditing(true);
    }
  }, [id]);

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const handleSearch = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      if (isEditing) {
        console.log(customer);
        const response = await customersAPI.update(id, customer);
        console.log(response.data);
      } else {
        await Axios.post("https://localhost:8000/api/customers", customer);
        history.replace("/customers");
      }
      setErrors({});
    } catch (error) {
      console.log(error.response);
      if (error.response.data.violations) {
        const submitErrors = [];
        error.response.data.violations.forEach(
          (v) => (submitErrors[v.propertyPath] = v.message)
        );
        setErrors(submitErrors);
        //setErrors({lastName: "toto", firstName:'tt'});
      }
    }
  };

  return (
    <>
      {(!isEditing && <h1>Création d'un client</h1>) || (
        <h1>Modification d'un client</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          onChange={handleSearch}
          value={customer.lastName}
          //  isrequired="required"
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          onChange={handleSearch}
          value={customer.firstName}
          //  isrequired="required"
          error={errors.firstName}
        />
        <Field
          name="email"
          //type="email"
          label="Email"
          onChange={handleSearch}
          value={customer.email}
          //   isrequired="required"
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          onChange={handleSearch}
          value={customer.company}
          //   isrequired="required"
          error={errors.company}
        />

        <div className="form-group">
          <Link className="btn btn-danger mr-5" to="/customers">
            retour
          </Link>
          <button type="submit" className="btn btn-success">
            {(!isEditing && "créer le client") || "modifier le client"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
