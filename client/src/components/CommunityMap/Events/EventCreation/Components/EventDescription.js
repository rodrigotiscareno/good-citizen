import React from "react";
import TextField from '@material-ui/core/TextField';

function EventDescription(props) {
    return (
        <>
            <h3>Event Description</h3>
            <TextField
                label="Event Description"
                multiline
                minRows={7}
                variant="outlined"
                required
                onChange={props.handleChange}
                value={props.eventDescription}
                error={props.errorHandling}
                helperText={(props.errorHandling) && "Please enter an event description!"}
                style={{ minWidth: "80%" }}>
            </TextField>
        </>
    )
}

export default EventDescription