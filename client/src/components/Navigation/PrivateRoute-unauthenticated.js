import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Landing from "../Landing";
import SignUp from "../Signup";
import SignIn from "../Signin";
import PasswordReset from "../PasswordReset";

export default function PrivateRouteUnauthenticated() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/signin" exact component={SignIn} />
        <Route path="/reset" exact component={PasswordReset} />
      </Switch>
    </BrowserRouter>
  );
}
