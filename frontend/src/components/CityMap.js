
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

function CityMap({ selectedTrip, congestionShape, currentVehicle }) {
    useEffect(() => {
        console.log("SelectedBusID in Map: " + selectedTrip)
    }, [selectedTrip]);

    return (
        <div className="map">

            <MapContainer center={[52.3676, 4.9041]} zoom={13} style={{ height: "100vh", width: "100vw" }} zoomControl={false}>

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {selectedTrip && (
                    <Polyline
                        positions={selectedTrip.shapes.map(shape => [shape.shape_pt_lat, shape.shape_pt_lon])}
                        color={currentVehicle ? "green" : "blue"}
                    />
                )}

                {selectedTrip && !currentVehicle && (
                    <div className="bus-message">
                        <img src="/icon/info.png" alt="Info" className="bus-icon" />
                            The bus is currently not in operation.
                        </div>
                )}

                {selectedTrip && selectedTrip.stop_times.map((stop, index) => (
                    <Marker key={index} position={[stop.location.latitude, stop.location.longitude]}>
                        <Popup>{stop.stop_name} (Arrival Time: {stop.arrival_time}, Departure Time: {stop.departure_time})</Popup>
                    </Marker>
                ))}

                {//Draw the bus marker only if the bus is in operation
                    currentVehicle &&  (
                    <Marker position={[currentVehicle.current_position.latitude, currentVehicle.current_position.longitude]}>
                        <Popup>Bus Position</Popup>
                    </Marker>
                )}

                {//Draw the congestion shape only if the bus is in operation
                    congestionShape && (
                    <Polyline positions={congestionShape.map(shape => [shape.shape_pt_lat, shape.shape_pt_lon])} color={getCongestionColor(currentVehicle.congestion_level.level)} />
                )}

            </MapContainer>
            </div>

    );
}

function getCongestionColor(level) {
    switch (level) {
        case 0:
            return "green";
        case 1:
            return "orange";
        case 2:
            return "red";
        default:
            return "blue";
    }
}

export default CityMap;

