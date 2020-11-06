import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthAPI from "../services/authAPI";
import AuthContext from "../context/AuthContext";

export const Navbar = (props) => {

const { isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

  /**
   * gestion de la déconnexion
   */
  const handleLogout = () => {
    AuthAPI.logout();
   // props.onLogout(false);
    setIsAuthenticated(false);
    props.history.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <NavLink className="navbar-brand" to="/">
        SymReact
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor01"
        aria-controls="navbarColor01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/customers">
              Clients
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/invoices">
              Factures
            </NavLink>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          {/* {(!props.isAuthenticated && ( */}
            {(!isAuthenticated && (
            <>
              <li className="nav-item">
                <NavLink to="/register" className="btn btn-nav-link">
                  Inscription
                </NavLink>
              </li>
              <li className="nav-item mx-1">
                <NavLink to="/login" className="btn btn-success">
                  Connexion
                </NavLink>
              </li>
            </>
          )) || (
            <li className="nav-item">
              <button
                href="#"
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
