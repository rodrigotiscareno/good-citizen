import React, { useState, useEffect } from "react";
import { Grid, Typography, Divider, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { serverUrl } from "../../../constants/constants";
import MyAppBar from "../../MyAppBar";
import TabBar from "../../TabBar";
import { useAuth } from "../../Firebase/firebase";
import MiniMap from "./MiniMap";
import EventRSVP from "./EventRSVP";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    fontWeight: "bold",
  },
  location: {
    fontStyle: "italic",
  },
  description: {
    marginTop: theme.spacing(2),
  },
  criteria: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  host: {
    marginTop: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function EventProfile(props) {
  const classes = useStyles();
  const { event_id } = useParams();
  const currentUser = useAuth();
  const authenticated = Boolean(currentUser);

  const [eventInfo, setEventInfo] = useState({});
  const [center, setCenter] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getEventInfo = (isMounted) => {
    fetch(`${serverUrl}/api/getEventInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id: event_id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          var parsed = JSON.parse(data.response);
          setEventInfo(parsed[0]);
          setCenter({ lat: parsed[0].centre_lat, lng: parsed[0].centre_long });
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getEventInfo(isMounted);
    return () => {
      isMounted = false;
    };
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

  console.log(center);

  return (
    <>
      <MyAppBar authenticated={authenticated} />
      {!isLoading && (
        <div className="map-container">
          <MiniMap coordinates={center} />
        </div>
      )}
      <div className={classes.root}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.title}>
              {eventInfo.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" className={classes.location}>
              {eventInfo.location}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              {formatDate(eventInfo.date_start)} -{" "}
              {formatDate(eventInfo.date_end)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <b>Hosted by:</b> {eventInfo.host_name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" className={classes.description}>
              {eventInfo.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" className={classes.criteria}>
              <b>Criteria:</b> {eventInfo.invite_criteria}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {currentUser?.user_id === eventInfo.user_id ? (
              "You are the host of the event."
            ) : (
              <EventRSVP currentUser={currentUser} event={eventInfo} />
            )}
          </Grid>
        </Grid>
      </div>
      <TabBar />
    </>
  );
}

export default EventProfile;
