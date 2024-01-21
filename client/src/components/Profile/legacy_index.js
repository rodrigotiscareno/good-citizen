import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../Firebase/firebase";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Grid,
} from "@material-ui/core";
import { deleteUserAccount } from "../Firebase/firebase";
import { useHistory, Link } from "react-router-dom";
import { serverUrl } from "../../constants/constants";
import MyAppBar from "../MyAppBar";
import TabBar from "../TabBar";
import Swal from "sweetalert2";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(3),
  },
  avatarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  name: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  interests: {
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(2),
  },
  deleteButton: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  editButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  iconButton: {
    marginLeft: theme.spacing(1),
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
  divider: {
    margin: theme.spacing(3),
  },
}));

const TestProfile = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const currentUser = useAuth();
  const authenticated = Boolean(currentUser);
  const firstLetter = currentUser?.first_name.charAt(0);
  const [interests, setInterests] = useState([]);
  const [displayInterests, setDisplayInterests] = useState("");
  const [similarUsers, setSimilarUsers] = useState([]);
  const [sharedInterestsUsers, setSharedInterestsUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [notices, setNotices] = useState([]);
  const [showNotices, setShowNotices] = useState(false);
  const [gotInterests, setGotInterests] = useState(false);

  useEffect(() => {
    validateInterests();
  }, [currentUser?.interests]);

  const validateInterests = async () => {
    if (currentUser?.interests) {
      const interestsArray = currentUser.interests.split(",");
      setInterests(interestsArray);
      setDisplayInterests(interestsArray.join(", "));
    } else {
      setDisplayInterests("No Interests");
    }
  };

  const callApiDeleteAccount = async () => {
    const url = serverUrl + "/api/deleteAccount";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: currentUser.email,
      }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const loadPosts = () => {
    fetch(`${serverUrl}/api/loadUserPosts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.user_id,
      }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);
        setPosts(parsed);
        console.log(parsed);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadEvents = () => {
    fetch(`${serverUrl}/api/loadUserEvents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.user_id,
      }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);
        setEvents(parsed);
        console.log(parsed);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadNotices = () => {
    fetch(`${serverUrl}/api/loadUserNotices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.user_id,
      }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);
        setNotices(parsed);
        console.log(parsed);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleShowPosts = () => {
    if (posts.length === 0) {
      loadPosts();
    }
    setShowEvents(false);
    setShowNotices(false);
    setShowPosts(!showPosts);
  };

  const handleShowEvents = () => {
    if (events.length === 0) {
      loadEvents();
    }
    setShowPosts(false);
    setShowNotices(false);
    setShowEvents(!showEvents);
  };

  const handleShowNotices = () => {
    if (notices.length === 0) {
      loadNotices();
    }
    setShowPosts(false);
    setShowEvents(false);
    setShowNotices(!showNotices);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //gets similar users
  const getSimilarUsers = (interest) => {
    fetch(`${serverUrl}/api/getSimilarUsers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser?.user_id,
        interest: `%${interest}%`,
      }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);

        setSharedInterestsUsers(...sharedInterestsUsers, ...parsed);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //calls at the beginnning and runs through all the interests
  //saves the list of users
  useEffect(() => {
    interests.forEach((interest) => {
      getSimilarUsers(interest);
    });
  }, []);

  const handleAccountDeletion = async () => {
    try {
      handleClose();
      await deleteUserAccount();
      callApiDeleteAccount();
      Swal.fire({
        icon: "success",
        title: "Account Deletion Successful",
        text: "We're sorry to hear you go!",
      }).then(() => {
        history.push("/");
        window.location.reload();
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <MyAppBar authenticated={authenticated} />

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "50vh" }}
      >
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Avatar className={classes.avatar}>{firstLetter}</Avatar>
          <Typography variant="h3" className={classes.name}>
            {currentUser?.first_name} {currentUser?.last_name}
          </Typography>
          {(() => {
            if (currentUser?.user_type === "Good Citizen") {
              return (
                <Typography className={classes.interests}>
                  Interests: {displayInterests}
                </Typography>
              );
            } else if (currentUser?.user_type === "Business") {
              return (
                <Typography>
                  Business Name: {currentUser?.business_name}
                </Typography>
              );
            } else if (currentUser?.user_type === "Elected Offical") {
              return <Typography>Party: {currentUser?.party}</Typography>;
            }
          })()}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleShowPosts()}
            style={{ marginTop: "20px" }}
          >
            My Posts
          </Button>
          {showPosts && (
            <div
              style={{
                display: "flex",
                flexDirection: "columun",
                marginTop: "20px",
              }}
            >
              <div style={{ marginRight: "10px" }}>
                <Typography variant="h6">Content</Typography>
                {posts.map((post) => (
                  <Typography>{post.content}</Typography>
                ))}
                <Typography variant="h6">Date</Typography>
                {posts.map((post) => (
                  <Typography>{post.created_on}</Typography>
                ))}
              </div>
            </div>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleShowEvents()}
            style={{ marginTop: "20px" }}
          >
            My Events
          </Button>
          {showEvents && (
            <div
              style={{
                display: "flex",
                flexDirection: "columun",
                marginTop: "20px",
                marginRight: "10px",
              }}
            >
              <Typography variant="h6">Title</Typography>
              {events.map((event) => (
                <Typography>{event.title}</Typography>
              ))}
              <Typography variant="h6">Date Start</Typography>
              {events.map((event) => (
                <Typography>{event.date_start}</Typography>
              ))}
              <Typography variant="h6">Date End</Typography>
              {events.map((event) => (
                <Typography>{event.date_end}</Typography>
              ))}
              <Typography variant="h6">Description</Typography>
              {events.map((event) => (
                <Typography>{event.description}</Typography>
              ))}
            </div>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleShowNotices()}
            style={{ marginTop: "20px" }}
          >
            My Notices
          </Button>
          {showNotices && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: "20px",
                marginRight: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "20px",
                }}
              >
                <Typography variant="h6">Title</Typography>
                {notices.map((notice) => (
                  <Typography>{notice.title}</Typography>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "20px",
                }}
              >
                <Typography variant="h6">Date Start</Typography>
                {notices.map((notice) => (
                  <Typography>{notice.date_start}</Typography>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "20px",
                }}
              >
                <Typography variant="h6">Date End</Typography>
                {notices.map((notice) => (
                  <Typography>{notice.date_end}</Typography>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "5px",
                }}
              >
                <Typography variant="h6">Description</Typography>
                {notices.map((notice) => (
                  <Typography>{notice.description}</Typography>
                ))}
              </div>
            </div>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {sharedInterestsUsers.map((user) => {
            <Typography>{user.first_name}</Typography>;
          })}
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={handleOpen}
              style={{ marginRight: "10px" }}
            >
              Delete Account
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              component={Link}
              to="/editprofile"
            >
              Edit Account
            </Button>
          </div>
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete your account?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAccountDeletion} color="primary">
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <TabBar />
    </>
  );
};
export default TestProfile;
