import React, { useState, useEffect } from 'react'
import { Typography, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core'
import { serverUrl } from '../../../constants/constants';
import { makeStyles } from '@material-ui/core/styles';
import { enqueueSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
    attendees: {
        marginTop: theme.spacing(2),
    },
    listItem: {
        paddingLeft: 0,
    },
}));

function EventRSVP(props) {
    const classes = useStyles();
    const [attendees, setAttendees] = useState([])


    const getEventAttendees = () => {
        fetch(`${serverUrl}/api/getEventAttendees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                event_id: props.event.event_id
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                var parsed = JSON.parse(data.response);
                setAttendees(parsed)
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleRSVP = () => {
        fetch(`${serverUrl}/api/RSVP`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                event_id: props.event.event_id,
                user_id: props.currentUser.user_id
            }),
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.error(error);
            });
        getEventAttendees()
        enqueueSnackbar("RSVP'ed!", { variant: "success" });
        window.location.reload()
    }

    useEffect(() => {
        getEventAttendees()
    }, [])

    return (
        <>
            {attendees.findIndex(attendee => attendee.attendee_id === props.currentUser.user_id) === -1 &&
                <Button
                    variant="contained"
                    size="large"
                    style={{
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        '&:hover': {
                            backgroundColor: '#0d47a1',
                        },
                    }}
                    onClick={handleRSVP}
                >RSVP!</Button>}
            <div className={classes.attendees}>
                <Typography variant="body1">
                    <b>Attendees:</b>
                </Typography>
                <List>
                    {attendees.map((attendee) => (
                        <ListItem key={attendee.attendee_name} className={classes.listItem}>
                            <ListItemAvatar>
                                <Avatar>
                                    {attendee.attendee_name.charAt(0)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={attendee.attendee_name} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </>
    )
}

export default EventRSVP;