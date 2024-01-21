import React from "react";
import { useAuth } from "../Firebase/firebase";
import PrivateRouteAuthenticated from "../Navigation/PrivateRoute-authenticated";
import PrivateRouteUnauthenticated from "../Navigation/PrivateRoute-unauthenticated";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";

function App(props) {
  const currentUser = useAuth()

  if (currentUser) {
    return (
      <div>
        <CssBaseline />
        <SnackbarProvider />
        <PrivateRouteAuthenticated />
      </div>
    )
  } else {
    return (
      <div>
        <CssBaseline />
        <SnackbarProvider />
        <PrivateRouteUnauthenticated />
      </div>
    )
  }
}

export default App;
