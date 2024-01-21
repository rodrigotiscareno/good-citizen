import React from 'react';
import { Card, CardContent, Typography, Box, Button, CardActions } from "@material-ui/core";
import { Link } from 'react-router-dom'


function EventCard(props) {

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
        <Card >
            <CardContent>
                <Typography align="center" gutterBottom variant="h5" component="div">
                    {props.eventDetails.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {props.eventDetails.description}
                </Typography>
                <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                        <b>Start Time:</b> {formatDate(props.eventDetails.date_start)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>End Time:</b> {formatDate(props.eventDetails.date_end)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>Location:</b> {props.eventDetails.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>Host:</b> {props.eventDetails.user_name}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" component={Link} to={`/events/${props.eventDetails.event_id}`}>
                    Details
                </Button>
            </CardActions>
        </Card>
    )
}

export default EventCard;