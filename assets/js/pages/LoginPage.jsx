import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";

import AuthContext from "../context/AuthContext";

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
          <div className="form-group">
            <label htmlFor="username">Adresse mail</label>
            <input
              onChange={handleSearch}
              value={credentials.username}
              type="email"
              className={"form-control " + (error && " is-invalid")}
              name="username"
              id="username"
              placeholder="Adresse mail..."
              required
            />
            <p className="invalid-feedback">{error}</p>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              value={credentials.password}
              onChange={handleSearch}
              type="password"
              className="form-control"
              name="password"
              id="password"
              placeholder="Mot de passe..."
              required
            />
          </div>
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

// export default function LoginPage() {
//     return (
//         <div>
//             <h1>connexino à l'application</h1>
//         </div>
//     )
// }
