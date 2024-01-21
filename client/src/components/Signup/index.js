import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  FormControl,
  MenuItem,
  InputLabel,
  Dialog,
  DialogActions,
  Select,
  Checkbox,
  ListItemText,
} from "@material-ui/core";
import { Email, Lock } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { signup } from "../Firebase/firebase";
import { useHistory } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { serverUrl } from "../../constants/constants";

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
    "& > .unique-fields": {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2),
    },
  },
  button: {
    marginTop: theme.spacing(2),
  },
  checkbox: {
    alignSelf: "flex-start",
  },
  checkboxLabel: {
    alignItems: "center",
    color: theme.palette.primary.main,
    textDecoration: "underline",
    marginLeft: theme.spacing(0.5),
  },
  error: {
    color: theme.palette.error.main,
  },
}));

function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState([]);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [party, setParty] = useState("");
  const [position, setPosition] = useState("");
  const [userType, setUserType] = useState("");

  const PrivacyPolicyDialog = () => {
    return (
      <div style={{ padding: "0 16px" }}>
        <Typography style={{ textAlign: "center" }} variant="h4">
          Privacy Policy
        </Typography>
        <Typography variant="body1">
          Our neighborhood app is committed to protecting your privacy. This
          Privacy Policy describes how we collect, use, and share information
          about you.
        </Typography>
        <Typography variant="body1">
          <b>Information we collect</b>: We collect information about you when
          you use our app. This includes information such as your name, email
          address, and phone number.
        </Typography>
        <Typography variant="body1">
          <b>How we use your information</b>: We use your information to provide
          and improve our services to you. This includes things like connecting
          you with neighbors, and allowing you to share updates and events with
          your community.
        </Typography>
        <Typography variant="body1">
          <b>Sharing your information</b>: We will not sell or rent your
          personal information to anyone. However, we may share your information
          with third-party service providers who assist us in providing our
          services to you. We may also share your information if required by law
          or if we believe that such disclosure is necessary to protect our
          rights or the safety of others.
        </Typography>
        <Typography variant="body1">
          <b>Security</b>: We take reasonable measures to protect your
          information from unauthorized access or disclosure. However, no
          security measure can guarantee 100% security.
        </Typography>
        <Typography variant="body1">
          <b>Updates to this policy</b>: We may update this Privacy Policy from
          time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </Typography>
        <Typography variant="body1">
          <b>Contact us</b>: If you have any questions about this Privacy
          Policy, please contact Devansh Kaloti at (289) 260 2717.
        </Typography>
      </div>
    );
  };

  const interestValues = [
    "Hiking",
    "Yoga",
    "Cooking",
    "Photography",
    "Writing",
    "Traveling",
    "Painting",
    "Reading",
    "Gardening",
    "Music",
    "Design",
    "Coding",
    "Knitting",
    "Dancing",
    "Filmmaking",
    "Sculpting",
    "Calligraphy",
    "Instrument",
    "Singing",
    "Acting",
    "Poetry",
    "Gaming",
    "Surfing",
    "Skateboarding",
    "Snowboarding",
    "Skiing",
    "Climbing",
    "Biking",
    "Fishing",
    "Hunting",
    "Running",
    "Cycling",
    "Swimming",
    "Tennis",
    "Basketball",
    "Soccer",
    "Football",
    "Baseball",
    "Volleyball",
    "Golf",
    "Pingpong",
    "Chess",
    "Cards",
    "Board games",
    "Stamps",
    "Coins",
    "Figurines",
    "Vintage",
  ];

  const callApiSignup = async (interestsString) => {
    const url = serverUrl + "/api/signup";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        postalCode: postalCode,
        neighborhood_id: 1,
        interests: interestsString,
        businessName: businessName,
        businessType: businessType,
        party: party,
        position: position,
        userType: userType,
      }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(email, password);
      const interestsString = interests.join(",");
      callApiSignup(interestsString);
      enqueueSnackbar("Signed-up!", { variant: "success" });
      history.push("/");
      window.location.reload();
    } catch (error) {
      setError(error.message);
      window.location.reload();
    }

    setLoading(false);
  };

  const handleInterests = (event) => {
    const {
      target: { value },
    } = event;
    setInterests(
      // On autofill we get a stringified value.

      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            size="small"
            fullWidth
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
            InputProps={{
              startAdornment: <Email />,
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
            InputProps={{
              startAdornment: <Lock />,
            }}
          />
          <TextField
            label="First Name"
            type="text"
            variant="outlined"
            size="small"
            fullWidth
            value={firstName}
            required
            onChange={(event) => setFirstName(event.target.value)}
          />
          <TextField
            label="Last Name"
            type="text"
            variant="outlined"
            size="small"
            fullWidth
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
          <TextField
            label="Postal Code"
            type="text"
            variant="outlined"
            size="small"
            required
            fullWidth
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel>User Type</InputLabel>
            <Select
              labelId="SignUpUserType"
              id="UserType"
              size="small"
              required
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              label="User Type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Good Citizen"}>Good Citizen</MenuItem>
              <MenuItem value={"Business"}>Business</MenuItem>
              <MenuItem value={"Elected Offical"}>Elected Offical</MenuItem>
            </Select>
          </FormControl>
          {(() => {
            if (userType === "Good Citizen") {
              return (
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Interests</InputLabel>
                  <Select
                    labelId="Interests"
                    id="Interests"
                    size="small"
                    multiple
                    value={interests}
                    onChange={handleInterests}
                    label="Interests"
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {interestValues.map((interest) => (
                      <MenuItem key={interest} value={interest}>
                        <Checkbox checked={interests.indexOf(interest) > -1} />
                        <ListItemText primary={interest} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            } else if (userType === "Business") {
              return (
                <div className="unique-fields">
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Business Type</InputLabel>
                    <Select
                      labelId="Business Type"
                      id="Business Type"
                      size="small"
                      required
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      label="Business Type"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"Automotive"}>Automotive</MenuItem>
                      <MenuItem value={"Education"}>Education</MenuItem>
                      <MenuItem value={"Entertainment"}>
                        Entertainment and Media
                      </MenuItem>
                      <MenuItem value={"Financial"}>
                        Financial Services
                      </MenuItem>
                      <MenuItem value={"F&B"}>Food and Beverage</MenuItem>
                      <MenuItem value={"Hospitality"}>Hospitality</MenuItem>
                      <MenuItem value={"IT"}>Information Technology</MenuItem>
                      <MenuItem value={"RealEstate"}>Real Estate</MenuItem>
                      <MenuItem value={"Retail"}>Retail</MenuItem>
                      <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Business Name"
                    variant="outlined"
                    size="small"
                    required
                    value={businessName}
                    type="text"
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              );
            } else if (userType === "Elected Offical") {
              return (
                <div className="unique-fields">
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Party</InputLabel>
                    <Select
                      labelId="Party"
                      id="Party"
                      size="small"
                      required
                      value={party}
                      onChange={(e) => setParty(e.target.value)}
                      label="Party Affilition"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"Conservative"}>Conservative</MenuItem>
                      <MenuItem value={"Liberal"}>Liberal</MenuItem>
                      <MenuItem value={"NDP"}>NDP</MenuItem>
                      <MenuItem value={"Independent"}>Independent</MenuItem>
                      <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Position"
                    variant="outlined"
                    size="small"
                    required
                    value={position}
                    type="text"
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
              );
            }
          })()}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              required
              color="primary"
              inputProps={{ "aria-label": "checkbox" }}
              className={classes.checkbox}
            />
            <span>
              I agree to the
              <Link
                to="#"
                onClick={handleOpen}
                className={classes.checkboxLabel}
              >
                Privacy Policy
              </Link>
            </span>
          </div>

          <Dialog open={open} onClose={handleClose}>
            <PrivacyPolicyDialog />
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

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
            Sign Up
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default SignUp;
