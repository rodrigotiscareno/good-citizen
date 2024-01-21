import React, { useState } from "react";
import { Typography, Button, CardContent, Card } from "@material-ui/core";
import { serverUrl } from "../../constants/constants";


function UserPosts(props) {

  const [posts, setPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [notices, setNotices] = useState([]);
  const [showNotices, setShowNotices] = useState(false);

  const loadPosts = () => {
    fetch(`${serverUrl}/api/loadUserPosts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: props.currentUser.user_id,
      }),
    })
      .then((response) => {
        console.log(response)
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
        userId: props.currentUser.user_id,
      }),
    })
      .then((response) => {
        console.log(response)
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
        userId: props.currentUser.user_id,
      }),
    })
      .then((response) => {
        console.log(response)
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
  }

  const handleShowEvents = () => {
    if (events.length === 0) {
      loadEvents();
    }
    setShowPosts(false);
    setShowNotices(false);
    setShowEvents(!showEvents);
  }

  const handleShowNotices = () => {
    if (notices.length === 0) {
      loadNotices();
    }
    setShowPosts(false);
    setShowEvents(false);
    setShowNotices(!showNotices);
  }


  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate
  }

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleShowPosts()}
        style={{ marginTop: "20px" }}
      >
        My Posts
      </Button>


      {showPosts && (
        <Card style={{ width: 500, marginTop: "20px" }}>
          <CardContent>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ marginRight: "10px" }}>
                {posts.map((post) => (
                  <>
                    <Typography variant='h6'><b>Content: </b>{post.content}</Typography>
                    <Typography variant="body1"><b>Date: </b>{post.created_on}</Typography>
                  </>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
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
        <Card style={{ margin: "20px", width: 500 }}>
          {events.map((event) => (
            <div key={event.id} style={{ padding: "20px" }}>
              <Typography variant="h6"><b>Title</b></Typography>
              <Typography>{event.title}</Typography>
              <Typography variant="h6"><b>Date Start</b></Typography>
              <Typography>{formatDate(event.date_start)}</Typography>
              <Typography variant="h6"><b>Date End</b></Typography>
              <Typography>{formatDate(event.date_end)}</Typography>
              <Typography variant="h6"><b>Description</b></Typography>
              <Typography>{event.description}</Typography>
            </div>
          ))}
        </Card>
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
        notices.map((notice) => (
          <Card key={notice.id} style={{ marginBottom: "20px" }}>
            <CardContent>
              <Typography variant="h6"><b>Title</b></Typography>
              <Typography>{notice.title}</Typography>
              <Typography variant="h6"><b>Date Start</b></Typography>
              <Typography>{formatDate(notice.date_start)}</Typography>
              <Typography variant="h6"><b>Date End</b></Typography>
              <Typography>{formatDate(notice.date_end)}</Typography>
              <Typography variant="h6"><b>Description</b></Typography>
              <Typography>{notice.description}</Typography>
            </CardContent>
          </Card>
        ))
      )}

    </>)
}

export default UserPosts;