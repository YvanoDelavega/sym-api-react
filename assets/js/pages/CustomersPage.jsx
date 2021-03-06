import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";

export const CustomersPage = (params) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue");
    }
  };

  // va chercher les customers au chargement
  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    const saveCustomers = [...customers];
    setCustomers(customers.filter((c) => c.id !== id));

    try {
      await CustomersAPI.delete(id);
      toast.success("Le client a bien été supprimée");
    } catch (error) {
      console.log(error.response);
      setCustomers(saveCustomers);
      toast.error("Une erreur est survenue lors de la suppression");
    }

    //     CustomersAPI.delete(id)
    //       .then((r) => console.log(id))
    //       .catch((error) => {
    //         console.log(error.response);
    //         setCustomers(saveCustomers);
    //       });
  };

  const handlePageChange = (page) => {
    console.log(page);
    setcurrentPage(page);
  };

  const itemsPerPage = 10;
  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSearch = (evt) => {
    setSearch(evt.currentTarget.value);
    setcurrentPage(1);
  };

  //   const pagesCount = Math.ceil(customers.length / itemsPerPage);
  //   const pages = [];
  //   for (let i = 1; i <= pagesCount; i++) {
  //     pages.push(i);
  //   }

  // d'ou on part (start) pdt combien de temps (itemsperpage)
  //const start = currentPage * itemsPerPage - itemsPerPage;
  //const paginatedCustormers = customers.slice(start, start + itemsPerPage);
  const paginatedCustormers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          className="form-control"
          onChange={handleSearch}
          value={search}
          placeholder="rechercher..."
        />
      </div>

      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
      {/* <div>
        <ul className="pagination pagination-sm">
          <li className={"page-item" + (currentPage <= 1 && " disabled")}>
            <button
              className="page-link"
              href="#"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &laquo;
            </button>
          </li>
          {pages.map((page) => (
            // https://fr.reactjs.org/docs/conditional-rendering.html
            //(currentPage === page ? " active" : "") s'ecit aussi (currentPage === page && " active")
            <li
              key={page}
              className={"page-item" + (currentPage === page && " active")}
            >
              <button
                className="page-link"
                href="#"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          <li
            className={"page-item" + (currentPage >= pagesCount && " disabled")}
          >
            <button
              className="page-link"
              href="#"
              onClick={() => setcurrentPage(currentPage + 1)}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </div> */}

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

        {!loading && (
          <tbody>
            {paginatedCustormers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"/customers/" + customer.id}>
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td>
                  <Link to={"/customers/" + customer.id}>{customer.email}</Link>
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
        )}
      </table>
      {loading && <TableLoader />}
    </>
  );
};
