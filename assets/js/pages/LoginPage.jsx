import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";

import AuthContext from "../context/AuthContext";
import Field from "../components/forms/Field";

export const LoginPage = (props) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);

  /**
   * gestion des champs
   * @param {*} param0
   */
  const handleSearch = ({ currentTarget }) => {
    const { value, name } = currentTarget;

    setCredentials({ ...credentials, [name]: value });
  };

  /**
   * gestion du submit
   * @param {*} evt
   */
  const handleSubmit = async (evt) => {
    evt.preventDefault(); // pour ne pas que la page soit rechargée, ce qui est le comportement par défaut

    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      //  props.onLogin(true);
      setIsAuthenticated(true);
      props.history.replace("/customers");
    } catch (error) {
      setError(
        "Les informations de connexion sont invalides ou le compte n'existe pas"
      );
    }
  };

  return (
    <>
      <h1>connexion à l'application</h1>

      <div className="bg-light py-3 px-3">
        <form onSubmit={handleSubmit}>
          <Field
            name="username"
            label="Adresse mail"
            onChange={handleSearch}
            value={credentials.username}
            type="email"
            placeholder="Adresse mail de connexion"
            error={error}
            isrequired="required"
          />

          <Field
            name="password"
            label="Mot de passe"
            onChange={handleSearch}
            value={credentials.password}
            type="password"
            error={error}
            isrequired="required"
          />

          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Connexion !
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
