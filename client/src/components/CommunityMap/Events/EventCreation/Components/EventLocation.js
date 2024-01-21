import React from "react";
import { GoogleComponent } from "react-google-location";

const API_KEY = "";

function EventLocation(props) {
  return (
    <div style={{ position: "relative", width: "50%", textAlign: "center" }}>
      <GoogleComponent
        apiKey={API_KEY}
        language={"en"}
        country={"country:can|country:us"}
        coordinates={true}
        placeholder={"Event Location"}
        locationBoxStyle={"custom-style"}
        onChange={props.handleChange}
        style={{ position: "absolute" }}
      />
    </div>
  );
}

export default EventLocation;
