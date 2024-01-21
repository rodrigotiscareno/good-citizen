import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { enqueueSnackbar } from "notistack";
import { Fab } from "@mui/material";
import InsertComment from "@mui/icons-material/InsertComment";
import { serverUrl } from "../../constants/constants";

const NewComment = (props: any) => {
  const [comment, setComment] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const currentUser: any = props.currentUser;
  const saveComment = () => {
    let id = {};

    switch (props.type) {
      case "feed":
        id = { feed_id: props.id };
        break;
      case "voice":
        id = { voice_id: props.id };
        break;
      default:
        break;
    }

    fetch(`${serverUrl}/services/comment/add`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUser?.user_id ?? 1,
        content: comment,
        ...id,
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {});

    enqueueSnackbar("Commented!", { variant: "success" });
    setComment("");
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Fab
        color="primary"
        style={{
          margin: 0,
          top: "auto",
          right: 20,
          bottom: 20,
          left: "auto",
          position: "fixed",
        }}
        onClick={handleClickOpen}
      >
        <InsertComment />
      </Fab>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Chime In!</DialogTitle>
        <DialogContent>
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            multiline
            rows={5}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveComment}>Comment</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewComment;
