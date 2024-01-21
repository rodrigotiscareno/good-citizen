import React from "react";
import NoticeCard from "./NoticeCard";
import { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IconButton } from "@material-ui/core";
import { MdLocalPolice } from "react-icons/md";
import { MdAnnouncement } from "react-icons/md";
import { MdInfo } from "react-icons/md";

function NoticeMarker(props) {
  const [showPopup, setShowPopup] = React.useState(false);

  return (
    <div key={props.singleNotice.notice_id}>
      <Marker
        scale={0.1}
        latitude={props.singleNotice.centre_lat}
        longitude={props.singleNotice.centre_long}
        anchor="auto"
      >
        <IconButton onClick={() => setShowPopup(true)}>
          {props.singleNotice.type == "general" && (
            <MdAnnouncement style={{ color: "#FF8A5B" }}></MdAnnouncement>
          )}
          {props.singleNotice.type == "safety" && (
            <MdLocalPolice style={{ color: "#800000" }}></MdLocalPolice>
          )}
          {props.singleNotice.type == "information" && (
            <MdInfo style={{ color: "#9ACD32" }}></MdInfo>
          )}
        </IconButton>
      </Marker>
      {showPopup && (
        <div>
          <Popup
            latitude={props.singleNotice.centre_lat}
            longitude={props.singleNotice.centre_long}
            anchor="bottom"
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
          >
            <NoticeCard notice={props.singleNotice}></NoticeCard>
          </Popup>
        </div>
      )}
    </div>
  );
}
export default NoticeMarker;
