import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { useAuth, logout } from "../Firebase/firebase";
import { ExitToApp } from "@material-ui/icons";
import MyAppBar from "../MyAppBar";
import TabBar from "../TabBar";
import { enqueueSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(10),
  },
  header: {
    marginBottom: theme.spacing(5),
  },
  title: {
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    marginBottom: theme.spacing(5),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function Landing() {
  const classes = useStyles();
  const currentUser = useAuth();
  const history = useHistory();

  var today = new Date();
  var curHr = today.getHours();
  let welcomeMessage;
  if (curHr < 12) {
    welcomeMessage = "Good Morning";
  } else if (curHr < 18) {
    welcomeMessage = "Good Afternoon";
  } else {
    welcomeMessage = "Good Evening";
  }

  const handleLogout = async () => {
    try {
      await logout();
      enqueueSnackbar("Logged-out Successfully", { variant: "success" });
      history.push("/");
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  const members = [
    {
      name: "Rodrigo Tiscareno",
      title: "Senior Data Engineer",
      description:
        "Rodrigo is the best in his field. Poached from one of the biggest hedge funds in the world, BAM.",
      image: "Rodrigo.jpeg",
    },
    {
      name: "Devansh Kaloti",
      title: "Senior Software Developer",
      description:
        "Devansh is one of the best software developers in his MSCI 342 class and is a tremendous asset.",
      image: "Devansh.jpeg",
    },
    {
      name: "Youssef Abadeer",
      title: "Senior Product Manager",
      description:
        "Youssef knows how to manage projects to extremes no one has ever gone.",
      image: "Youssef.jpeg",
    },
    {
      name: "Inesh Jacob",
      title: "Senior Developer",
      description:
        "Inesh codes all day and everyday. He sleeps, breathes and codes, thats it.",
      image: "Inesh.jpeg",
    },
  ];

  return (
    <>
      <MyAppBar
        logoutFunction={handleLogout}
        authenticated={Boolean(currentUser)}
      />
      <div className={classes.root}>
        <Grid container justifyContent="center">
          <Grid item xs={10} sm={8} md={6}>
            <div className={classes.header}>
              <Typography variant="h3" align="center" className={classes.title}>
                {welcomeMessage}
                {currentUser ? ", " + currentUser.first_name : ""}
              </Typography>
              <Typography
                style={{ marginTop: 50 }}
                variant="h5"
                align="center"
                className={classes.subtitle}
              >
                Welcome to Good Citizen, a neighbourhood social network designed to connect community
                members through events, announcements, and more.
              </Typography>
              <Grid container justifyContent="center" style={{ marginTop: 45 }}>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  style={{ marginRight: 25 }}
                >
                  Sign Up
                </Button>
                <Button
                  component={Link}
                  to="/signin"
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  style={{ marginLeft: 25, marginRight: 25 }}
                >
                  Login
                </Button>
                {currentUser ? <Button
                  variant="contained"
                  color="error"
                  className={classes.button}
                  startIcon={<ExitToApp />}
                  onClick={handleLogout}
                  style={{ marginLeft: 25, marginRight: 25 }}
                >
                  Logout
                </Button> : null}
              </Grid>
            </div>
          </Grid>
          <Grid container justifyContent="center">
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={10} sm={6} md={8} >
                <div className={classes.header}>
                  <Typography variant="h3" align="center" className={classes.title} style={{ marginTop: 55 }}>
                    Our Mission
                  </Typography>
                  <Typography variant="h6" align="center" className={classes.subtitle} style={{ marginTop: 35 }}>
                    Our mission at Good Citizen is to connect you to your community and foster life-long friendships. We believe that the key to a strong and healthy community is through the relationships between its members. Our app provides a platform for neighbors to come together and organize events, sign petitions, and engage with each other in meaningful ways. With Good Citizen, you can stay informed about what's happening in your area and get involved in causes that matter to you.

                    We strive to promote a sense of belonging and empower our users to make a positive impact in their communities. Join us in building a more connected and compassionate world, one neighbor at a time.
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid item xs={10} sm={8} md={6}>
              <div className={classes.header}>
                <Typography
                  variant="h3"
                  align="center"
                  className={classes.title}
                  style={{ marginTop: 55 }}
                >
                  About the Team
                </Typography>
              </div>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            justifyContent="center"
            style={{ marginBottom: 150 }}
          >
            {members.map((member) => (
              <Grid
                item
                xs={2}
                key={member.name}
                style={{ marginLeft: 10, marginRight: 10 }}
              >
                <Card className={classes.card} elevation={3}>
                  <CardMedia
                    component="img"
                    height="50"
                    width="25"
                    className={classes.media}
                    image={member.image}
                    title={member.name}
                  />
                  <CardContent style={{ minHeight: 200 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {member.title}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {member.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div>
      {currentUser && <TabBar />}
    </>
  );
}

export default Landing;
