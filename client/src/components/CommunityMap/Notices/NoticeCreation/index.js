import React from "react";
import MyAppBar from "../../../MyAppBar";
import TabBar from "../../../TabBar";
import NoticeName from "./Components/NoticeName";
import { Typography } from "@material-ui/core";
import { Stack } from "@mui/system";
import NoticeDescription from "./Components/NoticeDescription";
import NoticeSchedule from "./Components/NoticeSchedule";
import NoticeLocation from "./Components/NoticeLocation";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useAuth } from "../../../Firebase/firebase";
import { enqueueSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

import { serverUrl } from "../../../../constants/constants";

const NoticeCreation = () => {
  const history = useHistory();

  const [noticeName, setNoticeName] = React.useState("");
  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [noticeStartTime, setNoticeStartTime] = React.useState("");
  const [noticeEndTime, setNoticeEndTime] = React.useState("");
  const [noticeLocation, setNoticeLocation] = React.useState("");
  const [noticeLat, setNoticeLat] = React.useState("");
  const [noticeLong, setNoticeLong] = React.useState("");

  const [noticeNameValidation, setNoticeNameValidation] = React.useState(false);
  const [bodyValidation, setBodyValidation] = React.useState(false);
  const [startTimeValidation, setStartTimeValidation] = React.useState(false);
  const [endTimeValidation, setEndTimeValidation] = React.useState(false);

  const currentUser = useAuth();
  const authenticated = Boolean(currentUser);

  const callApiAddNotice = async () => {
    const url = serverUrl + "/api/addNotice";
    var submittedNotice = {
      noticeName: noticeName,
      noticeDescription: description,
      hostUserID: currentUser.user_id,
      noticeStartTime: noticeStartTime,
      noticeEndTime: noticeEndTime,
      noticeLocation: noticeLocation,
      noticeLat: noticeLat,
      noticeLong: noticeLong,
      icon: type,
      type: type,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submittedNotice),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const enteredNoticeName = (event) => {
    setNoticeName(event.target.value);
  };

  const enteredType = (event) => {
    setType(event.target.value);
  };

  const enteredDescription = (event) => {
    setDescription(event.target.value);
  };

  const enteredStartTime = (event) => {
    setNoticeStartTime(event.target.value);
  };

  const enteredEndTime = (event) => {
    setNoticeEndTime(event.target.value);
  };

  const enteredNoticeLocation = (event) => {
    console.log(event);
    setNoticeLocation(event.place);
    setNoticeLat(event.coordinates.lat);
    setNoticeLong(event.coordinates.lng);
  };

  const updateNotice = () => {
    var stopProceedings = false;

    if (!noticeName) {
      setNoticeNameValidation(true);
      stopProceedings = true;
    }

    if (!NoticeDescription) {
      setBodyValidation(true);
      stopProceedings = true;
    }

    if (noticeStartTime == "") {
      setStartTimeValidation(true);
      stopProceedings = true;
    }

    if (noticeEndTime == "") {
      setEndTimeValidation(true);
      stopProceedings = true;
    }

    if (stopProceedings) {
      return;
    }
    callApiAddNotice();
    enqueueSnackbar("Notice Created Successfully", { variant: "success" });
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
          Create a Notice
        </Typography>
        <NoticeName
          noticeName={noticeName}
          handleChange={enteredNoticeName}
          errorHandling={noticeNameValidation}
        ></NoticeName>
        <NoticeDescription
          icon={type}
          handleTypeChange={enteredType}
          description={description}
          handleDescriptionChange={enteredDescription}
          errorHandling={bodyValidation}
        ></NoticeDescription>
        <NoticeSchedule
          label={"Notice Start Time"}
          noticeTime={noticeStartTime}
          handleChange={enteredStartTime}
          errorHandling={startTimeValidation}
        ></NoticeSchedule>
        <NoticeSchedule
          label={"Notice End Time"}
          noticeTime={noticeEndTime}
          handleChange={enteredEndTime}
          errorHandling={endTimeValidation}
        ></NoticeSchedule>
        <NoticeLocation handleChange={enteredNoticeLocation}></NoticeLocation>
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
              marginBottom: 25,
              backgroundColor: "#1976d2",
              color: "#fff",
            }}
            variant="contained"
            onClick={updateNotice}
          >
            Create Notice
          </Button>
          <Button
            color="primary"
            style={{
              marginTop: 40,
              marginBottom: 25,
              backgroundColor: "#1976d2",
              color: "#fff",
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
};
export default NoticeCreation;
