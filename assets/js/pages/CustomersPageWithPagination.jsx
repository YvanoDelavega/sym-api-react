import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

export const CustomersPageWithPagination = (params) => {
  //const CustomersPage = props => {
  const [customers, setCustomers] = useState([]);
  const [totalItems, settotalItems] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [loading, setloading] = useState(true);
  const itemsPerPage = 10;
  //}

  useEffect(() => {
    axios
      .get(
        `https://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
      )
      // .then((reponse) => console.log(reponse));
      //.then((reponse) => console.log(reponse.data['hydra:member']));
      .then((reponse) => {
        setCustomers(reponse.data["hydra:member"]);
        settotalItems(reponse.data["hydra:totalItems"]);
        setloading(false);
      })

      //   reponse.data["hydra:member"])
      //.then((data) => setCustomers(data))
      .catch((error) => console.log(error.response));
  }, [currentPage]);

  const handleDelete = (id) => {
    const saveCustomers = [...customers];

    setCustomers(customers.filter((c) => c.id !== id));

    axios
      .delete("https://localhost:8000/api/customers/" + id)
      .then((r) => console.log(id))
      .catch((error) => {
        console.log(error.response);
        setCustomers(customers);
      });
  };

  const handlePageChange = (page) => {
    setloading(true);
    setcurrentPage(page);
  };

  // const paginatedCustormers = Pagination.getData(
  //   customers,
  //   currentPage,
  //   itemsPerPage
  // );

  return (
    <>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
      <h1 className="">Liste des clients (avec pagination)</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>

          {loading && (
            <tr>
              <td>Chargement...</td>
            </tr>
          )}

          {!loading &&
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  {customer.firstName} {customer.lastName}
                </td>
                <td>
                  <a href="#">{customer.email}</a>
                </td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-primary">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()} €
                </td>
                <td className="text-center">
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};
