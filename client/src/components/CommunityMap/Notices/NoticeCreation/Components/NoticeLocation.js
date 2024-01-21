import React from "react";
import { GoogleComponent } from "react-google-location";

const API_KEY = "KEY_HERE";

function NoticeLocation(props) {
  return (
    <div style={{ position: "relative", width: "50%", textAlign: "center" }}>
      <h3>Notice Address</h3>
      <GoogleComponent
        apiKey={API_KEY}
        language={"en"}
        country={"country:can|country:us"}
        coordinates={true}
        placeholder={"Notice Location"}
        locationBoxStyle={"custom-style"}
        onChange={props.handleChange}
        style={{ position: "absolute" }}
      />
    </div>
  );
}

export default NoticeLocation;
