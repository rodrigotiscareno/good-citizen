import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { useAuth } from "../Firebase/firebase";
import { Link } from "react-router-dom";
import MyAppBar from "../MyAppBar";
import TabBar from "../TabBar";

import { serverUrl } from "../../constants/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
    height: "100%",
  },
  header: {
    fontWeight: "bold",
    fontSize: "2rem",
    marginBottom: theme.spacing(3),
  },
  list: {
    width: "100%",
    maxWidth: 360,
    borderRadius: "5px",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
  },
  listItem: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  listItemText: {
    fontWeight: "bold",
  },
}));

const Chat = () => {
  const [users, setUsers] = useState([]);
  const classes = useStyles();
  const currentUser = useAuth();
  const authenticated = Boolean(currentUser);

  const getUsers = () => {
    fetch(`${serverUrl}/api/getUsers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUser.user_id,
        neighborhood_id: currentUser.neighborhood_id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);
        setUsers(parsed);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    getUsers();
  }, [currentUser]);

  return (
    <>
      <MyAppBar authenticated={authenticated} />
      <Box className={classes.root}>
        <Typography className={classes.header}>Message a Neighbor!</Typography>
        <List className={classes.list}>
          {users.map((user) => (
            <ListItem key={user.user_id} className={classes.listItem}>
              <Link to={`/chat/${currentUser.user_id}/${user.user_id}`}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    {user.first_name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.first_name + " " + user.last_name}
                  className={classes.listItemText}
                />
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
      <TabBar />
    </>
  );
};

export default Chat;
