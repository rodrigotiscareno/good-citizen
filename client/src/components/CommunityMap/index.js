import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactMapGL from "react-map-gl";
import MyAppBar from "../MyAppBar";
import TabBar from "../TabBar";
import EventMarker from "./Events/EventMap/EventMarker";
import NoticeMarker from "./Notices/NoticeMap/NoticeMarker";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { serverUrl } from "../../constants/constants";
import { useAuth } from "../Firebase/firebase";

const fetch = require("node-fetch");

function CommunityMap() {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);

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

  const loadNotices = () => {
    callApiGetNotices().then((res) => {
      var notices = JSON.parse(res.express);
      setNotices(notices);
    });
  };

  const loadEvents = () => {
    callApiGetEvents().then((res) => {
      var events = JSON.parse(res.express);
      setEvents(events);
    });
  };

  useEffect(() => {
    loadEvents();
    loadNotices();
  }, []);

  const [viewport, setViewport] = React.useState({
    longitude: -80.4925,
    latitude: 43.4516,
    zoom: 12,
    width: "100vw",
    height: "100vh",
  });

  return (
    <>
      <Button
        variant="contained"
        size="large"
        style={{
          position: "absolute",
          width: 200,
          marginTop: 100,
          marginLeft: 100,
          zIndex: 1,
          backgroundColor: "#1976d2",
          color: "#fff",
        }}
        component={Link}
        to="/create-event"
      >
        Create Event
      </Button>
      <Button
        variant="contained"
        size="large"
        style={{
          position: "absolute",
          width: 200,
          marginTop: 150,
          marginLeft: 100,
          zIndex: 1,
          backgroundColor: "#1976d2",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
        component={Link}
        to="/create-notice"
      >
        Create Notice
      </Button>
      <Button
        variant="contained"
        size="large"
        style={{
          position: "absolute",
          width: 200,
          marginTop: 200,
          marginLeft: 100,
          zIndex: 1,
          backgroundColor: "#1976d2",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#0d47a1",
          },
        }}
        component={Link}
        to="/view-events-and-notices"
      >
        View All
      </Button>

      <MyAppBar authenticated={authenticated} />
      <ReactMapGL
        class="community_map"
        {...viewport}
        mapboxApiAccessToken="KEY_HERE"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        style={{ zIndex: 0 }}
      >
        {events.map((singleEvent) => {
          return (
            <EventMarker
              singleEvent={singleEvent}
              viewport={viewport}
            ></EventMarker>
          );
        })}
        {notices.map((singleNotice) => {
          return (
            <NoticeMarker
              singleNotice={singleNotice}
              viewport={viewport}
            ></NoticeMarker>
          );
        })}
      </ReactMapGL>
      <TabBar />
    </>
  );
}

export default CommunityMap;
