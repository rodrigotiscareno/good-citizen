import React, { useState } from "react";
import { useAuth, db } from "../Firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(2),
  },
  input: {
    marginRight: theme.spacing(2),
  },
  button: {
    backgroundColor: "#395dff",
    color: "#fff",
  },
}));

const SendMessage = ({ scroll }) => {
  const [input, setInput] = useState("");
  const currentUser = useAuth();
  const classes = useStyles();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Please enter a valid message.");
      return;
    }
    await addDoc(collection(db, "messages"), {
      text: input,
      email: currentUser.email,
      name: currentUser.first_name,
      timestamp: serverTimestamp(),
    });
    setInput("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form onSubmit={sendMessage} className={classes.form}>
      <TextField
        className={classes.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="Message"
        variant="outlined"
      />
      <Button type="submit" variant="contained" className={classes.button}>
        Send
      </Button>
    </form>
  );
};

export default SendMessage;
