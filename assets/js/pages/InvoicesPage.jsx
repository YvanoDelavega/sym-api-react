import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";
//import 'moment/min/moment-with-locales'

export const InvoicesPage = (params) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const STATUS_CLASSE = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger",
  };

  const STATUS_NAME = {
    PAID: "payé",
    SENT: "envoyé",
    CANCELLED: "annulé",
  };

  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // va chercher les invoices au chargement
  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    const saveInvoices = [...invoices];
    setInvoices(invoices.filter((c) => c.id !== id));

    try {
      await InvoicesAPI.delete(id);
    } catch (error) {
      console.log(error.response);
      setInvoices(saveInvoices);
    }
  };

  const handlePageChange = (page) => {
    //console.log(page);
    setcurrentPage(page);
  };

  const itemsPerPage = 20;
  const filteredInvoices = invoices.filter(
    (c) =>
      c.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      STATUS_NAME[c.status].toLowerCase().includes(search.toLowerCase()) ||
      c.amount.toString().startsWith(search.toLowerCase())
  );

  const handleSearch = (evt) => {
    setSearch(evt.currentTarget.value);
    setcurrentPage(1);
  };

  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  // componentDidMount = () => {
  //  console.log(moment.locale())
  //  console.log(moment.locale('zh-cn'))
  //  console.log(moment.locale())
  // }

  const formatDate = (str) => moment(str).format("DD/MM/YYYY");
  //const formatDate = (str) => moment(str).format("lll");
  // moment.locale();
  // return moment(str).format("MMMM Do YYYY, h:mm");

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des factures</h1>
        <Link to="/invoices/new" className="btn btn-primary">
          Créer une facture
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

      {itemsPerPage < filteredInvoices.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredInvoices.length}
          onPageChanged={handlePageChange}
        />
      )}

      <table className="table table-hover">
        <thead>
          <tr>
            <th>n°</th>
            <th>Client</th>
            <th>Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.chrono}</td>
              <td>
                <Link to={"/customers/" + invoice.customer.id}>
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </Link>
              </td>
              <td>{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSE[invoice.status]}
                >
                  {STATUS_NAME[invoice.status]}
                </span>
              </td>
              <td className="text-center">{invoice.amount} €</td>
              <td className="text-center">
                <Link
                  to={"/invoices/" + invoice.id}
                  className="btn btn-sm btn-primary mr-1"
                >
                  Editer
                </Link>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  // disabled={invoice.invoices.length > 0}
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
