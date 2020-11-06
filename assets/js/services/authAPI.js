import Axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * requete http d'authentification et stockage du token dans le storage et sur axios
 * @param {*} credentials 
 */
function authenticate(credentials) {
  return Axios.post("https://localhost:8000/api/login_check", credentials)
    .then((response) => response.data.token)
    .then((token) => {
      window.localStorage.setItem("authToken", token);
      // on prévient axios qu'on a maintenant un header par défaut dans toutes nos requetes http
      setAxiosToken(token);

      return true;
    });
}

// function register(user) {
//   return Axios("https://localhost:8000/api/login_check");
// }

/**
 * déconnexion
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete Axios.defaults.headers["Authorization"];
}

/**
 * prévient axios qu'on a maintenant un header par défaut dans toutes nos requetes http
 */
function setAxiosToken(token) {
  Axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * mise en place du token lors du chargement de l'appli
 */
function setup() {
  // voir si on a une token
  const token = window.localStorage.getItem("authToken");
  // si le token est encore valide
  if (token) {
    // ici je peux destructure ma donnée pour ne prendre que ce que je veux
    // const jwtData = jwtDecode(token);
    const { exp: expiration } = jwtDecode(token); // je ne prends qula prop "exp" et je la renomme en "expiration"
    // attention new Date().getTime() donne des millisecondes, pour l'avoir en seconde, il faudrait diviser par 1000
    // ou multiplier par mille le jwtData.exp
    //if (jwtData.exp * 1000 > new Date().getTime()) {
    if (expiration * 1000 > new Date().getTime()) setAxiosToken(token);
    //else logout();
  } //else logout();
 // if (isAuthenticated()) setAxiosToken(token);
}

/**
 * permet de savoir si on est authentitfié ou pas
 * @return boolean
 */
function isAuthenticated() {
  // voir si on a une token
  const token = window.localStorage.getItem("authToken");
  // si le token est encore valide
  if (token) {
    // ici je peux destructure ma donnée pour ne prendre que ce que je veux
    // const jwtData = jwtDecode(token);
    const { exp: expiration } = jwtDecode(token); // je ne prends qula prop "exp" et je la renomme en "expiration"
    // attention new Date().getTime() donne des millisecondes, pour l'avoir en seconde, il faudrait diviser par 1000
    // ou multiplier par mille le jwtData.exp
    //if (jwtData.exp * 1000 > new Date().getTime()) {
    return (expiration * 1000 > new Date().getTime());
  } 
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
};
