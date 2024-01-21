import React, { useEffect, useState } from "react";
import MyAppBar from "../MyAppBar";
import TabBar from "../TabBar";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../Firebase/firebase";
import { serverUrl } from "../../constants/constants";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FlagIcon from "@mui/icons-material/Flag";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import MessageIcon from "@mui/icons-material/Message";
import dayjs from "dayjs";
const useStyles = makeStyles({
  container: {
    marginTop: 25,
    overflow: "hidden",
  },
  title: {
    marginTop: "30px",
    marginBottom: "30px",
    fontFamily: "SF Pro",
    fontStyle: "normal",
    fontWeight: "590",
    fontSize: "36px",
    lineHeight: "43px",
    color: "#1D3557",
  },
  content: {
    minHeight: "200px",
  },
  secondaryActions: {
    border: "1px solid #BFBFBF",
    borderRadius: "6px",

    color: "#1D3557",
    textTransform: "none",
    height: "58px",

    fontFamily: "SF Pro",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "16px",
  },
  divider: {
    marginTop: "40px",
    marginBottom: "40px",
  },
});

const Feed = () => {
  const [content, setContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editContentId, setEditContentId] = useState(-1);
  const classes = useStyles();

  const currentUser = useAuth();
  const authenticated = Boolean(currentUser);

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const share = () => {
    fetch(`${serverUrl}/api/addPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.user_id,
        content: content,
        neighborhoodId: currentUser.neighborhood_id,
      }),
    })
      .then((response) => {
        getPosts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getPosts = () => {
    fetch(`${serverUrl}/api/getPosts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        neighborhoodId: currentUser.neighborhood_id,
      }),
    })
      .then((response) => {
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

  const getComments = () => {
    fetch(`${serverUrl}/api/getComments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        neighborhoodId: currentUser.neighborhood_id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);
        setComments(parsed);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const savePost = () => {
    fetch(`${serverUrl}/api/editPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedId: editContentId,
        content: editContent,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);

        setEditContent("");
        setEditContentId(-1);
        getPosts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deletePost = () => {
    fetch(`${serverUrl}/api/deletePost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedId: deletePostId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);
        setDeletePostId(null);
        getPosts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const flagPost = () => {
    fetch(`${serverUrl}/api/flagPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedId: flagPostId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var parsed = JSON.parse(data.response);
        setFlagPostId(null);
        getPosts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const reshare = (id) => {
    fetch(`${serverUrl}/api/resharePost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.user_id,
        content: posts[id].content,
        neighborhoodId: currentUser.neighborhood_id,
        parentFeedId: posts[id].feed_id,
      }),
    })
      .then((response) => {
        getPosts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addComment = () => {
    fetch(`${serverUrl}/api/addComment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.user_id,
        content: comment,
        feedId: requestCommentPostId,
      }),
    })
      .then((response) => {
        setRequestCommentPostId(null);
        getComments();
        getPosts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [flagPostId, setFlagPostId] = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const [requestCommentPostId, setRequestCommentPostId] = useState(null);
  const [comment, setComment] = useState("");
  const handleClose = () => {
    setDeletePostId(null);
  };

  const handleCommentClose = () => {
    setRequestCommentPostId(null);
  };

  const handleConfirmFlagClose = () => {
    setFlagPostId(null);
  };

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    getPosts();
    getComments();
  }, [currentUser]);

  return (
    <>
      <MyAppBar authenticated={authenticated} />
      <Dialog open={requestCommentPostId !== null} onClose={handleCommentClose}>
        <DialogTitle>Add a comment!</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            placeholder="Comment"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCommentClose}>Cancel</Button>
          <Button onClick={addComment}>Add Comment</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={flagPostId !== null} onClose={handleClose}>
        <DialogTitle>{"Are you sure you want to flag this post?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            By flagging this post as inappropriate, this post will be
            immediately unpublished until it is reviewed by a moderator.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmFlagClose}>Cancel</Button>
          <Button onClick={flagPost}>Flag as Inappropriate</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deletePostId !== null} onClose={handleClose}>
        <DialogTitle>
          {"Are you sure you want to delete this post?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deletePost}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12}></Grid>

        <Grid item xs={12}>
          <Card>
            <TextField
              fullWidth
              placeholder="What's on your mind?"
              multiline
              variant="outlined"
              value={content}
              type="text"
              onChange={(e) => setContent(e.target.value)}
            />
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Button
            fullWidth
            variant="outlined"
            className={classes.secondaryActions}
            onClick={share}
            style={{ height: "45px" }}
          >
            Share
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12}>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {posts.map((post, i) => (
              <>
                <ListItem alignItems="flex-start" key={i}>
                  {editContentId === post.feed_id ? (
                    <ListItemText>
                      <Grid container spacing={2}>
                        <Grid item xs={11}>
                          <TextField
                            fullWidth
                            placeholder="Update your post"
                            multiline
                            variant="outlined"
                            value={editContent}
                            type="text"
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <Button
                            style={{ marginLeft: 10 }}
                            variant="text"
                            onClick={savePost}
                          >
                            Save
                          </Button>
                          <Button
                            variant="text"
                            onClick={() => {
                              setEditContentId(-1);
                              setEditContent("");
                            }}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </ListItemText>
                  ) : (
                    <ListItemText
                      primary={post.content}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {post.parent_feed_id !== null ? "Reshared by " : ""}
                            {post.first_name + " " + post.last_name} -{" "}
                          </Typography>
                          {dayjs(post.created_at).format("MMM D, YYYY h:MM A")}
                          {post.user_id == currentUser.user_id && (
                            <>
                              <IconButton
                                style={{ marginLeft: 5 }}
                                variant="text"
                                onClick={() => {
                                  setEditContentId(post.feed_id);
                                  setEditContent(post.content);
                                }}
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                style={{ marginLeft: 5 }}
                                variant="text"
                                onClick={() => {
                                  setDeletePostId(post.feed_id);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}

                          <IconButton
                            style={{ marginLeft: 5 }}
                            variant="text"
                            onClick={() => {
                              setFlagPostId(post.feed_id);
                            }}
                          >
                            <FlagIcon />
                          </IconButton>
                          <IconButton
                            variant="text"
                            onClick={() => {
                              reshare(i);
                            }}
                          >
                            <ReplyAllIcon />
                          </IconButton>
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setRequestCommentPostId(post.feed_id);
                            }}
                          >
                            <MessageIcon />
                          </IconButton>
                          <br />
                          <b>Comments</b>
                          {comments.map(
                            (comment, i) =>
                              comment.feed_id == post.feed_id && (
                                <>
                                  <ListItem alignItems="flex-start" key={i}>
                                    <ListItemText
                                      primary={`${comment.first_name} said ${comment.content}`}
                                    />
                                  </ListItem>
                                </>
                              )
                          )}
                        </React.Fragment>
                      }
                    />
                  )}
                </ListItem>
                <Divider component="li" />
              </>
            ))}
          </List>
        </Grid>
      </Grid>
      <TabBar />
    </>
  );
};
export default Feed;
