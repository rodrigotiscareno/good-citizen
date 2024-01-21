import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Stack } from "@mui/system";
import { useAuth } from "../Firebase/firebase";
import { serverUrl } from "../../constants/constants";
import MyAppBar from "../MyAppBar";
import TabBar from "../TabBar";

const useStyles = makeStyles({
  root: {
    maxWidth: 600,
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 100,
  },
  card: {
    margin: "1rem",
    minWidth: 275,
    flexGrow: 1,
  },
  header: {
    marginBottom: "1rem",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  content: {
    textAlign: "left",
  },
});

const NoticesAndEvents = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [showNotices, setShowNotices] = useState(null);
  const authenticated = Boolean(useAuth());

  const callApiGetEvents = async () => {
    const url = serverUrl + "/api/loadEvents";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const callApiGetNotices = async () => {
    const url = serverUrl + "/api/loadNotices";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const loadNoticesAndEvents = async () => {
    const [noticesResponse, eventsResponse] = await Promise.all([
      callApiGetNotices(),
      callApiGetEvents(),
    ]);
    const notices = JSON.parse(noticesResponse.express);
    const events = JSON.parse(eventsResponse.express);
    setNotices(notices);
    setEvents(events);
  };

  useEffect(() => {
    loadNoticesAndEvents();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
  }

  const items =
    showNotices === true
      ? notices
      : showNotices === false
      ? events
      : notices.concat(events);

  return (
    <>
      <MyAppBar authenticated={authenticated} />
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: 30 }}
        spacing={2}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={() => setShowNotices(null)}
          style={{ backgroundColor: "#1976d2" }}
        >
          View All
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setShowNotices(true)}
          style={{ backgroundColor: "#1976d2" }}
        >
          Notices
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setShowNotices(false)}
          style={{ backgroundColor: "#1976d2" }}
        >
          Events
        </Button>
        <Button
          color="primary"
          style={{ backgroundColor: "#1976d2" }}
          variant="contained"
          component={Link}
          to="/community-map"
        >
          Return to Map
        </Button>
      </Stack>

      <div className={classes.root}>
        {items.map((item) => (
          <Card key={item.id} className={classes.card}>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                className={classes.header}
              >
                {item.title}
              </Typography>
              <Typography variant="body2" component="p">
                {item.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Start Time: </b>
                {formatDate(item.date_start)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>End Time: </b>
                {formatDate(item.date_end)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Location: </b>
                {item.location}
              </Typography>
              user_name
              <Typography variant="body2" color="text.secondary">
                <b>Publisher: </b>
                {item.user_name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
      <TabBar />
    </>
  );
};

export default NoticesAndEvents;
