import React from "react";
import { useAuth } from "../Firebase/firebase";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  message: {
    display: "flex",
    alignItems: "center",
    boxShadow: theme.shadows[4],
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    position: "relative",
  },
  name: {
    position: "absolute",
    top: theme.spacing(-4),
    color: theme.palette.text.secondary,
    fontSize: theme.typography.body2.fontSize,
  },
  sent: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    flexDirection: "row-reverse",
    textAlign: "end",
    float: "right",
    borderRadius: `${theme.spacing(2)}px 0 0 ${theme.spacing(2)}px`,
  },
  received: {
    background: theme.palette.grey[200],
    color: theme.palette.text.primary,
    float: "left",
    borderRadius: `0 ${theme.spacing(2)}px ${theme.spacing(2)}px 0`,
  },
}));

const Message = ({ message }) => {
  const currentUser = useAuth();
  const classes = useStyles();

  let messageClass;
  if (currentUser) {
    messageClass =
      message.email === currentUser.email ? classes.sent : classes.received;
  }

  return (
    <div>
      <Paper
        className={`${classes.message} ${messageClass}`}
        variant="outlined"
      >
        <p className={classes.name}>{message.name}</p>
        <p>{message.text}</p>
      </Paper>
    </div>
  );
};

export default Message;
