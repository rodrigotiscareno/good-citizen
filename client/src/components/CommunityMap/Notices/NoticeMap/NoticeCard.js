import React from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  Typography,
  Box,
  Button,
} from "@material-ui/core";

function NoticeCard(props) {
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

  return (
    <div>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography
              align="center"
              gutterBottom
              variant="h4"
              component="div"
            >
              {props.notice.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {props.notice.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Start Time: </b>
              {formatDate(props.notice.date_start)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>End Time: </b>
              {formatDate(props.notice.date_end)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Location: </b>
              {props.notice.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Publisher: </b>
              {props.notice.user_name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default NoticeCard;
