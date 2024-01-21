import React from 'react'
import ReactMapGL from "react-map-gl";
import { Marker } from 'react-map-gl';
import { IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function MiniMap(props) {

    const [viewport, setViewport] = React.useState({
        longitude: -80.4925,
        latitude: 43.4516,
        zoom: 12,
        width: '100vw',
        height: '50vh',
    });

    console.log(props.coordinates.lat, props.coordinates.lng);

    return (
        <>
            <ReactMapGL
                class="community_map"
                {...viewport}
                mapboxApiAccessToken="pk.eyJ1Ijoicm9kcmlnb3Rpc2NhcmVubyIsImEiOiJjbGVnNjB1MXEwaGk2M3JtenRmYW0xYXRtIn0.43k_-g3UMczFEBAXwEDOYQ"
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                style={{ zIndex: 0 }}
            >
                <Marker
                    longitude={props.coordinates.lng}
                    latitude={props.coordinates.lat}
                >
                    <IconButton >
                        <LocationOnIcon style={{ color: '#1E90FF' }} />
                    </IconButton>
                </Marker>
            </ReactMapGL>
        </>
    )
}

export default MiniMap;
