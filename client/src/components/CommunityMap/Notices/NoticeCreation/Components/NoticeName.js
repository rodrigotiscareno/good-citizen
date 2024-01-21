import React from "react";
import TextField from "@material-ui/core/TextField";

function NoticeName(props) {
  return (
    <>
      <form autoComplete="off">
        <TextField
          value={props.noticeName}
          required
          id="standard-required"
          label="Notice Name"
          onChange={props.handleChange}
          error={props.errorHandling}
          helperText={props.errorHandling && "Please enter your notice title!"}
        />
      </form>
    </>
  );
}

export default NoticeName;
