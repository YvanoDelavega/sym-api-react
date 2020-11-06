import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  HashRouter,
  Route, Switch,
  withRouter
} from "react-router-dom";
import { Navbar } from "./js/components/Navbar";
import PrivateRoute from "./js/components/PrivateRoute";
import AuthContext from "./js/context/AuthContext";
import { CustomersPage } from "./js/pages/CustomersPage";
import { HomePage } from "./js/pages/HomePage";
import { InvoicesPage } from "./js/pages/InvoicesPage";
import { LoginPage } from "./js/pages/LoginPage";
import AuthAPI from "./js/services/authAPI";
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
import "./styles/app.css";


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

            <PrivateRoute
              path="/customers"
              // isAuthenticated={isAuthenticated}
              component={CustomersPage}
            />
            <PrivateRoute
              path="/invoices"
              //  isAuthenticated={isAuthenticated}
              component={InvoicesPage}
            />

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
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
