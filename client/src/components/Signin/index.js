import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Email, Lock } from "@material-ui/icons";
import { login } from "../Firebase/firebase";
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

function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      enqueueSnackbar("Logged-in!", { variant: "success" });
      history.push("/");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            id="email"
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
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            InputProps={{
              startAdornment: <Lock />,
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
            Sign In
          </Button>
          <Typography variant="body2" color="textSecondary" align="center">
            <Link to="/reset" style={{ color: "grey" }}>
              Forget your password?
            </Link>
          </Typography>
        </form>
      </Paper>
    </div>
  );
}

export default SignIn;
