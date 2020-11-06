import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import { Navbar } from "./js/components/Navbar";
import PrivateRoute from "./js/components/PrivateRoute";
import AuthContext from "./js/context/AuthContext";
import CustomerPage from "./js/pages/CustomerPage";
import { CustomersPage } from "./js/pages/CustomersPage";
import { HomePage } from "./js/pages/HomePage";
import { InvoicesPage } from "./js/pages/InvoicesPage";
import { InvoicePage } from "./js/pages/InvoicePage";
import { LoginPage } from "./js/pages/LoginPage";
import { RegisterPage } from "./js/pages/RegisterPage";
import AuthAPI from "./js/services/authAPI";
import "react-toastify/dist/ReactToastify.css";

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
import "./styles/app.css";
import { toast, ToastContainer } from "react-toastify";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

AuthAPI.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  // on fait ca pour que le composant Navbar qui n'est pas dans une route, puisse bénéfier ces props supplémentaires
  // données par une Route, notamment, la props history
  const NavbarWithRouter = withRouter(Navbar);

  console.log("isAuthenticated " + isAuthenticated);

  // const contextValue ={
  //   isAuthenticated:isAuthenticated,
  //   setIsAuthenticated:setIsAuthenticated
  // }
  // s'écrit de la meme facon en javascript
  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <HashRouter>
        <NavbarWithRouter
        //  isAuthenticated={isAuthenticated}
        //  onLogout={setIsAuthenticated}
        />

        <main className="container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />

            {/* <Route
              path="/login"
              render={(props) => (
                <LoginPage
                  //   isAuthenticated={isAuthenticated}
                  onLogin={setIsAuthenticated}
                  {...props}
                />
              )}
            /> */}
            <PrivateRoute path="/invoices/:id" component={InvoicePage} />
            <PrivateRoute path="/invoices" component={InvoicesPage} />
            <PrivateRoute path="/customers/:id" component={CustomerPage} />
            <PrivateRoute path="/customers" component={CustomersPage} />

            {/* <Route path="/customers" component={CustomersPage} /> */}

            {/* <Route
            path="/customers"
            render={(props) =>
              isAuthenticated ? (
                <CustomersPage {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          /> */}
            {/* <Route path="/invoices" component={InvoicesPage} /> */}
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT}/>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
