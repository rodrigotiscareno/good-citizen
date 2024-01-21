import React from 'react'
import TextField from '@material-ui/core/TextField';

function EventName(props) {
    return (
        <>
            <form autoComplete="off">
                <TextField
                    value={props.eventName}
                    required id="standard-required"
                    label="Event Name"
                    onChange={props.handleChange}
                    error={props.errorHandling}
                    helperText={(props.errorHandling) && "Please enter your event title"}
                />
            </form>
        </>
    )
}

export default EventName