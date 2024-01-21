import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import EventName from "./Components/EventName";
import EventDescription from "./Components/EventDescription";
import EventInviteCriteria from "./Components/EventInviteCriteria";
import EventSchedule from "./Components/EventSchedule";
import EventLocation from "./Components/EventLocation";
import MyAppBar from "../../../MyAppBar";
import TabBar from "../../../TabBar";
import { Link } from "react-router-dom";
import { useAuth } from "../../../Firebase/firebase";
import { serverUrl } from "../../../../constants/constants";
import { enqueueSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

const fetch = require("node-fetch");

function EventCreation() {
  const history = useHistory();

  const [eventName, setEventName] = React.useState("");
  const [eventDescription, setEventDescription] = React.useState("");
  const [criteria, setCriteria] = React.useState("");
  const [eventStartTime, setEventStartTime] = React.useState("");
  const [eventEndTime, setEventEndTime] = React.useState("");
  const [eventLocation, setEventLocation] = React.useState("");
  const [eventLat, setEventLat] = React.useState("");
  const [eventLong, setEventLong] = React.useState("");

  const [eventNameValidation, setEventNameValidation] = React.useState(false);
  const [bodyValidation, setBodyValidation] = React.useState(false);
  const [criteriaValidation, setCriteriaValidation] = React.useState(false);
  const [startTimeValidation, setStartTimeValidation] = React.useState(false);
  const [endTimeValidation, setEndTimeValidation] = React.useState(false);

  const currentUser = useAuth();
  const authenticated = Boolean(currentUser);

  const callApiAddEvent = async () => {
    const url = serverUrl + "/api/addEvent";
    var submittedEvent = {
      eventName: eventName,
      eventDescription: eventDescription,
      hostUserID: currentUser.user_id,
      criteria: criteria,
      eventStartTime: eventStartTime,
      eventEndTime: eventEndTime,
      eventLocation: eventLocation,
      eventLat: eventLat,
      eventLong: eventLong,
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submittedEvent),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const enteredEventName = (event) => {
    setEventName(event.target.value);
  };

  const enteredEventDescription = (event) => {
    setEventDescription(event.target.value);
  };

  const enteredStartTime = (event) => {
    setEventStartTime(event.target.value);
  };

  const enteredEndTime = (event) => {
    setEventEndTime(event.target.value);
  };

  const selectedCriteria = (event) => {
    setCriteria(event.target.value);
  };

  const enteredEventLocation = (event) => {
    setEventLocation(event.place);
    setEventLat(event.coordinates.lat);
    setEventLong(event.coordinates.lng);
  };

  const updateEvent = () => {
    var stopProceedings = false;

    if (!eventName) {
      setEventNameValidation(true);
      stopProceedings = true;
    }

    if (!eventDescription) {
      setBodyValidation(true);
      stopProceedings = true;
    }

    if (criteria == "") {
      setCriteriaValidation(true);
      stopProceedings = true;
    }

    if (eventStartTime == "") {
      setStartTimeValidation(true);
      stopProceedings = true;
    }

    if (eventEndTime == "") {
      setEndTimeValidation(true);
      stopProceedings = true;
    }

    if (stopProceedings) {
      return;
    }
    callApiAddEvent();
    enqueueSnackbar("Event Created Successfully", { variant: "success" });
    history.push("/community-map");
    window.location.reload();
  };

  return (
    <div>
      <MyAppBar authenticated={authenticated} />
      <Stack
        direction="column"
        justifyContent="space-evenly"
        alignItems="center"
        spacing={5}
      >
        <Typography variant="h3" style={{ marginTop: 30 }}>
          Create an Event
        </Typography>
        <EventName
          eventName={eventName}
          handleChange={enteredEventName}
          errorHandling={eventNameValidation}
        ></EventName>
        <EventDescription
          eventDescription={eventDescription}
          handleChange={enteredEventDescription}
          errorHandling={bodyValidation}
        ></EventDescription>
        <EventInviteCriteria
          criteria={criteria}
          handleChange={selectedCriteria}
        ></EventInviteCriteria>
        {criteriaValidation && "Please select the invite criteria."}
        <EventSchedule
          label={"Event Start Time"}
          eventTime={eventStartTime}
          handleChange={enteredStartTime}
          errorHandling={startTimeValidation}
        ></EventSchedule>
        <EventSchedule
          label={"Event End Time"}
          eventTime={eventEndTime}
          handleChange={enteredEndTime}
          errorHandling={endTimeValidation}
        ></EventSchedule>
        <EventLocation handleChange={enteredEventLocation}></EventLocation>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={4}
        >
          <Button
            color="primary"
            style={{
              marginTop: 40,
              marginBottom: 175,
              backgroundColor: "#1976d2",
              color: "#fff",
            }}
            variant="contained"
            onClick={updateEvent}
          >
            Create Event
          </Button>
          <Button
            color="primary"
            style={{
              marginTop: 40,
              marginBottom: 175,
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            variant="contained"
            component={Link}
            to="/community-map"
          >
            Return to Map
          </Button>
        </Stack>
      </Stack>
      <TabBar />
    </div>
  );
}

export default EventCreation;
