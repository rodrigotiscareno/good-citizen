import React from "react"
import EventCard from './EventCard';
import { Marker, Popup } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { IconButton } from '@material-ui/core';
import { MdCalendarToday } from "react-icons/md";
import { MdClose } from "react-icons/md";

function EventMarker(props) {

    const [showPopup, setShowPopup] = React.useState(false);
    return (
        <div key={props.singleEvent.event_id}>
            <Marker
                scale={0.1}
                latitude={props.singleEvent.centre_lat}
                longitude={props.singleEvent.centre_long}
                anchor="auto">
                <IconButton onClick={() => setShowPopup(true)}>
                    <MdCalendarToday style={{ color: '#1E90FF' }} ></MdCalendarToday>
                </IconButton>
            </Marker>
            {
                showPopup &&
                <div>
                    <Popup
                        latitude={props.singleEvent.centre_lat}
                        longitude={props.singleEvent.centre_long}
                        anchor="bottom"
                        isOpen={showPopup}
                        onClose={() => { }}
                        closeOnClick={false}
                        closeButton={false}
                    >
                        <div style={{ position: "relative" }}>
                            <IconButton
                                onClick={() => setShowPopup(false)}
                                style={{ position: "absolute", top: 0, right: 0 }}
                            >
                                <MdClose style={{ color: "red" }} />
                            </IconButton>
                            <EventCard eventDetails={props.singleEvent} />
                        </div>
                    </Popup>

                </div >
            }
        </div >
    )
}
export default EventMarker;
