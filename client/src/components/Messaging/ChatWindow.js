import React, { useState, useEffect } from "react";
import { db } from "../Firebase/firebase";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { Typography, TextField, Button, Paper, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { serverUrl } from "../../constants/constants";
import TabBar from "../TabBar";

const useStyles = makeStyles((theme) => ({
  message: {
    padding: theme.spacing(1),
    borderRadius: "10px",
    marginBottom: theme.spacing(1),
    maxWidth: "80%",
    border: "1px solid #d9d9d9",
  },
  sender: {
    backgroundColor: "#3f51b5",
    color: "white",
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  receiver: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  subtext: {
    fontSize: "0.8rem",
    opacity: 0.6,
    marginBottom: theme.spacing(0.5),
  },
}));

function ChatWindow() {
  const { userId1, userId2 } = useParams();
  const [user1Name, setUser1Name] = useState("");
  const [user2Name, setUser2Name] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const classes = useStyles();

  const getUsersFirstName = (ID, user_num) => {
    fetch(`${serverUrl}/api/getUserFirstName`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: ID,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);
        if (user_num === 1) {
          setUser1Name(parsed[0].first_name);
        } else if (user_num === 2) {
          setUser2Name(parsed[0].first_name);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messagesData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      messagesData = messagesData.filter(
        (message) =>
          (message.senderId === parseInt(userId1) &&
            message.receiverId === parseInt(userId2)) ||
          (message.senderId === parseInt(userId2) &&
            message.receiverId === parseInt(userId1))
      );
      setMessages(messagesData);
    });
    getUsersFirstName(userId1, 1);
    getUsersFirstName(userId2, 2);
    return () => unsubscribe();
  }, [userId1, userId2]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const messageData = {
      senderId: parseInt(userId1),
      receiverId: parseInt(userId2),
      message: message,
      timestamp: new Date(),
    };
    try {
      const docRef = await addDoc(collection(db, "messages"), messageData);
      console.log("Message added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding message: ", error);
    }
    setMessage("");
  };

  return (
    <Paper elevation={3}>
      <Box p={2}>
        <Typography style={{ textAlign: 'center' }} variant="h3">Chat with {user2Name}</Typography>
        <Box height="500px" overflow="auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${classes.message} ${message.senderId === parseInt(userId1)
                ? classes.sender
                : classes.receiver
                }`}
            >
              <Typography>{message.message}</Typography>
              <Typography variant="caption" className={classes.subtext}>
                {message.timestamp?.toDate()?.toLocaleString()}
              </Typography>
              <br></br>
              <Typography variant="caption" className={classes.subtext}>
                {message.senderId === parseInt(userId1) ? user1Name : user2Name}
              </Typography>
            </div>
          ))}
        </Box>
        <form onSubmit={handleSubmit}>
          <Box display="flex">
            <TextField
              fullWidth
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              label="Message"
              variant="outlined"
            />
            <Box ml={1}>
              <Button variant="contained" color="primary" type="submit">
                Send
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
      <TabBar />
    </Paper>
  );
}

export default ChatWindow;
