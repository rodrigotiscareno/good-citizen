import React, { useState, useEffect } from "react";
import {
  Typography,
  Avatar,
  Button,
  Grid,
  CardContent,
  Card,
} from "@material-ui/core";
import MyAppBar from "../MyAppBar";
import TabBar from "../TabBar";
import { useAuth, deleteUserAccount } from "../Firebase/firebase";
import { enqueueSnackbar } from "notistack";
import { useHistory, Link } from "react-router-dom";
import { serverUrl } from "../../constants/constants";
import UserPosts from "./posts";

function Profile() {
  const currentUser = useAuth();
  const authenticated = Boolean(currentUser);
  const history = useHistory();
  const [userInterests, setUserInterests] = useState([]);
  const [sharedInterestsUsers, setSharedInterestUsers] = useState([]);
  const [displayInterests, setDisplayInterests] = useState("");
  const [showInterests, setShowInterests] = useState(false);

  function getSimilarUsers(interestList) {
    fetch(`${serverUrl}/api/getSimilarUsers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interests: interestList,
        user_id: currentUser?.user_id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);
        setSharedInterestUsers(parsed);
        setShowInterests(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }

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

  const handleAccountDeletion = async () => {
    try {
      await deleteUserAccount();
      callApiDeleteAccount();
      enqueueSnackbar("Account Deletion Successful", { variant: "success" });
      history.push("/");
      window.location.reload();
    } catch (error) {
      console.log(error.message);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const validateInterests = async () => {
    if (currentUser?.interests) {
      setUserInterests(currentUser.interests.split(","));
      getSimilarUsers(currentUser.interests.split(","));
      setDisplayInterests(currentUser.interests.split(",").join(", "));
    } else {
      setDisplayInterests("No Interests");
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  function handleInterests() {
    validateInterests();
    getSimilarUsers();
  }

  return (
    <>
      <MyAppBar authenticated={authenticated} />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: "40px",
        }}
      >
        <Avatar
          style={{
            marginBottom: "20px",
            marginTop: "75px",
            fontSize: "48px",
            width: "100px",
            height: "100px",
          }}
        >
          {currentUser.first_name.charAt(0)}
        </Avatar>

        <Typography variant="h3" style={{ marginBottom: "40px" }}>
          {currentUser.first_name} {currentUser.last_name}
        </Typography>
        <Button
          variant="contained"
          size="large"
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0d47a1",
            },
            marginBottom: "20px",
            width: "350px",
          }}
          component={Link}
          to="/editprofile"
        >
          Edit Account
        </Button>
        <Button
          variant="contained"
          size="large"
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0d47a1",
            },
            marginBottom: "40px",
            width: "350px",
          }}
          onClick={handleAccountDeletion}
        >
          Be a bad Citizen (Delete Account)
        </Button>
        {(() => {
          if (currentUser?.user_type === "Good Citizen") {
            return (
              <Typography variant="h6">
                <b>Interests: </b> {displayInterests}
              </Typography>
            );
          } else if (currentUser?.user_type === "Business") {
            return (
              <Typography variant="h6">
                <b>Business Name: </b> {currentUser?.business_name}
              </Typography>
            );
          } else if (currentUser?.user_type === "Elected Offical") {
            return (
              <Typography variant="h6">
                <b>Party: </b>
                {currentUser?.party}
              </Typography>
            );
          }
        })()}
        <Typography style={{ marginTop: "30px" }} variant="h6">
          <b>Find people who share similar interests... </b>
          {currentUser?.party}
        </Typography>
        {showInterests &&
          sharedInterestsUsers.map((user) => {
            return (
              <Card style={{ marginTop: "40px" }} key={user.email}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="body1">
                      <b>Shared Interests:</b> {user.shared_interests}
                    </Typography>
                    <Typography variant="body1">
                      <b>Email: </b> {user.email}
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            );
          })}

        <Button
          variant="contained"
          size="large"
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0d47a1",
            },
            marginBottom: "40px",
            marginTop: "40px",
          }}
          onClick={handleInterests}
        >
          Like-minded people!
        </Button>
        <UserPosts currentUser={currentUser} />
        <TabBar />
      </div>
    </>
  );
}

export default Profile;
