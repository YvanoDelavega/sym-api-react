import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";

import AuthContext from "../context/AuthContext";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import Axios from "axios";
import usersAPI from "../services/usersAPI";
import { toast } from "react-toastify";

export const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    passwordConfirm: "",
  });

  /**
   * gestion des champs
   * @param {*} param0
   */
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  /**
   * gestion du submit
   * @param {*} evt
   */
  const handleSubmit = async (evt) => {
    evt.preventDefault(); // pour ne pas que la page soit rechargée, ce qui est le comportement par défaut
    const submitErrors = {};

    if (user.password !== user.passwordConfirm) {
      submitErrors.passwordConfirm =
        "Les 2 mots de passes ne sont pas identiques";
      setErrors(submitErrors);
      toast.success("Il y a des erreurs dans votre formulaire...");
      return;
    } 

    try {
      await usersAPI.register(user);
      setErrors({}); // a faire avant de changer de page sinon il faudra raffraichir la page alors qu'elle ne sera plus affichée
      toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter");
      history.replace("/login");
    } catch (error) {
      console.log(error.response);
      console.log("error.response");
      const { violations } = error.response.data;
      if (violations) {
        violations.forEach((v) => {
          // console.log(v.message);
          //  console.log("pp: "+submitErrors[v.propertyPath]);
          if (submitErrors[v.propertyPath] == null) {
            submitErrors[v.propertyPath] = v.message;
            // if (v.message !== "") {
            //   submitErrors[v.propertyPath] += v.message;
          }
        });
        setErrors(submitErrors);
        toast.success("Il y a des erreurs dans votre formulaire...");
      }
    }

    // try {
    //   await AuthAPI.authenticate(credentials);
    //   setError("");
    //   //  props.onLogin(true);
    //   setIsAuthenticated(true);
    //   props.history.replace("/customers");
    // } catch (error) {
    //   setError(
    //     "Les informations de connexion sont invalides ou le compte n'existe pas"
    //   );
    // }
  };

  return (
    <>
      <h1>Nouvelle inscription</h1>
      <div className="bg-light py-3 px-3">
        <form onSubmit={handleSubmit}>
          <Field
            name="firstName"
            label="Prénom"
            onChange={handleChange}
            value={user.fisrtName}
            placeholder="votre prénom"
            error={errors.firstName}
            //  isrequired="required"
          />
          <Field
            name="lastName"
            label="Nom de famille"
            onChange={handleChange}
            value={user.lastName}
            error={errors.lastName}
            //  isrequired="required"
          />
          <Field
            name="email"
            label="Adresse mail"
            onChange={handleChange}
            value={user.email}
            type="email"
            placeholder="Adresse mail de connexion"
            error={errors.email}
            //  isrequired="required"
          />

          <Field
            name="password"
            label="Mot de passe"
            onChange={handleChange}
            value={user.password}
            type="password"
            error={errors.password}
            //  isrequired="required"
          />
          <Field
            name="passwordConfirm"
            label="Mot de passe (confirmation)"
            onChange={handleChange}
            value={user.passwordConfirm}
            type="password"
            error={errors.passwordConfirm}
            placeholder="confirmer votre mot de passe"
            // isrequired="required"
          />

          <div className="form-group">
            <button type="submit" className="btn btn-success mr-5">
              Confirmation !
            </button>
            <Link className="btn btn-link" to="/login">
              j'ai déjà un compte
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
