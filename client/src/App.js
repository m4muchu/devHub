import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";

import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authAction";
import { clearCurrentProfile } from "./actions/profileActions";

import "./App.css";

import PrivateRoute from "../src/components/common/PrivateRoute";

import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import Landing from "./components/layouts/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "../src/dashboard/Dashboard";
import CreateProfile from "../src/components/create-profile/CreateProfile";

//check for token
// following things are doing to avoid flushing of token while refreashing
if (localStorage.jwtToken) {
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //Decode token and get user info and expire
  const decoded = jwt_decode(localStorage.jwtToken);
  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // LogOut user
    store.dispatch(logoutUser());
    //TODO: clear current profile
    store.dispatch(clearCurrentProfile());

    //redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />

            <Route exact path="/" component={Landing} />

            <div className="contaier">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
              </Switch>
            </div>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
