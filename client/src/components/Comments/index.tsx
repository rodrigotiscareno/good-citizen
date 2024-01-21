import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/20/solid";
import NewComment from "./NewComment";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Comments = (props: any) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [comments, setComments] = React.useState(props.initComments ?? []);

  return (
    <div>
      <span className="inline-flex items-center text-sm mt-2">
        <button
          type="button"
          className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
          onClick={handleClickOpen}
        >
          <ChatBubbleLeftEllipsisIcon className="h-5 w-5" aria-hidden="true" />
          <span className="font-medium text-gray-900"></span>
          <span className="sr-only">replies</span>
        </button>
      </span>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Comments
            </Typography>

            <NewComment
              type={"voice"}
              id={props.id}
              currentUser={props.currentUser}
            />
          </Toolbar>
        </AppBar>
        <List>
          {comments.map((comment: any) => {
            return (
              <>
                <ListItem button>
                  <ListItemText
                    primary={comment.content}
                    secondary={`${comment.user.first_name} ${comment.user.last_name}`}
                  />
                </ListItem>
                <Divider />
              </>
            );
          })}
        </List>
      </Dialog>
    </div>
  );
};

export default Comments;
