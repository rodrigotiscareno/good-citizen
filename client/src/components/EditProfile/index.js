import React, { useState, useEffect } from "react";
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
  Select,
  Checkbox,
  ListItemText,
} from "@material-ui/core";
import { useAuth } from "../Firebase/firebase";
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
  error: {
    color: theme.palette.error.main,
  },
}));

function EditProfile() {
  const classes = useStyles();
  const history = useHistory();
  const currentUser = useAuth();
  const [email, setEmail] = useState(currentUser?.email);
  const [firstName, setFirstName] = useState(currentUser?.first_name || "");
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
  const [userInformationFetched, setUserInformationFetched] = useState(false);

  useEffect(() => {
    if (currentUser && !userInformationFetched) {
      setEmail(currentUser?.email);
      setFirstName(currentUser?.first_name);
      setLastName(currentUser?.last_name);
      setPostalCode(currentUser?.postal_code);
      setBusinessName(currentUser?.business_name);
      setBusinessType(currentUser?.business_type);
      setParty(currentUser?.party);
      setPosition(currentUser?.position);
      setUserType(currentUser?.user_type);
      setUserInformationFetched(true);
    }
  }, [currentUser, userInformationFetched]);

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

  const callApiEdit = async (interestsString) => {
    const url = serverUrl + "/api/edit";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
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
      const interestsString = interests.join(",");
      callApiEdit(interestsString);
      enqueueSnackbar("Sucessfully changed!", { variant: "success" });
      history.push("/");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleInterests = (event) => {
    const {
      target: { value },
    } = event;
    setInterests(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" align="center" gutterBottom>
          Edit Profile
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            type="text"
            variant="outlined"
            size="small"
            fullWidth
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <TextField
            label="Last Name"
            type="text"
            variant="outlined"
            size="small"
            fullWidth
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
          <TextField
            label="Postal Code"
            type="text"
            variant="outlined"
            size="small"
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
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Position"
                    variant="outlined"
                    size="small"
                    value={position}
                    type="text"
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
              );
            }
          })()}
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
            Submit
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default EditProfile;
