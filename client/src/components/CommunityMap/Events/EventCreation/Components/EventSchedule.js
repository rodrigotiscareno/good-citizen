import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function EventSchedule(props) {

    return (
        <TextField
            id="datetime-local"
            label={props.label}
            type="datetime-local"
            value={props.eventTime}
            onChange={props.handleChange}
            error={props.errorHandling}
            helperText={props.errorHandling ? "Invalid time format" : ""}
            sx={{ width: 250 }}
            InputLabelProps={{
                shrink: true,
            }}
        />
    );
}
