import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Email } from "@material-ui/icons";
import { resetPassword } from "../Firebase/firebase";
import { enqueueSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  paper: {
    padding: theme.spacing(3),
    maxWidth: 400,
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  error: {
    color: theme.palette.error.main,
  },
}));

function PasswordReset() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await resetPassword(email);
      enqueueSnackbar("Password Reset Successful", { variant: "success" });
      history.push("/");
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" align="center" gutterBottom>
          Request Password Reset
        </Typography>
        <form className={classes.form} onSubmit={handleResetPassword}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            size="small"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            InputProps={{
              startAdornment: <Email />,
            }}
          />
          {error && (
            <Typography variant="body2" className={classes.error}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className={classes.button}
            fullWidth
            startIcon={loading && <CircularProgress size={20} />}
          >
            Request Reset
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default PasswordReset;
