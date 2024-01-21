import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { db } from "../Firebase/firebase";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    position: "relative",
    flexGrow: 1,
  },
}));

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();
  const classes = useStyles();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Paper className={classes.main} elevation={3}>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        <span ref={scroll}></span>
      </Paper>
      <SendMessage scroll={scroll} />
    </>
  );
};

export default Chat;
