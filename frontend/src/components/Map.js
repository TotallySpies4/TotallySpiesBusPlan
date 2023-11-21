import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

function Map({ selectedTrip, congestionShape, currentVehicle }) {
  useEffect(() => {
    console.log("SelectedBusID in Map: " + selectedTrip);
  }, [selectedTrip]);

  return (
    <div className="map">
      <MapContainer
        center={[52.3676, 4.9041]}
        zoom={13}
        style={{ height: "100vh", width: "100vw" }}
        zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Drawing stopes and shapes */}

        {selectedTrip && (
          <Polyline
            positions={selectedTrip.shapes.map((shape) => [
              shape.shape_pt_lat,
              shape.shape_pt_lon,
            ])}
            color={currentVehicle ? "#22c55e" : "#f0abfc"}
            />
        )}

        {selectedTrip && !currentVehicle && (
          <div className="bus-message">
            <img src="/icon/info.png" alt="Info" className="bus-icon" />
            The bus is currently not in operation.
          </div>
        )}

        {selectedTrip &&
          selectedTrip.stop_times.map((stop, index) => (
            <Marker
              key={index}
              position={[stop.location.latitude, stop.location.longitude]}>
              <Popup>
                <strong className="text-blue-500">{stop.stop_name}</strong>
                <br /> <strong>Arrival Time: </strong> {stop.arrival_time},
                <br /> <strong>Departure Time: </strong> {stop.departure_time})
              </Popup>
            </Marker>
          ))}

        {/* Drawing vehicle position */}
        {currentVehicle && (
          <Marker
            position={[
              currentVehicle.current_position.latitude,
              currentVehicle.current_position.longitude,
            ]}>
            <Popup>Bus Position</Popup>
          </Marker>
        )}

        {/* Drawing congestion shape */}
        {congestionShape && (
          <Polyline
            positions={congestionShape.map((shape) => [
              shape.shape_pt_lat,
              shape.shape_pt_lon,
            ])}
            color={getCongestionColor(currentVehicle.congestion_level.level)}
          />
        )}
      </MapContainer>
    </div>
  );
}

function getCongestionColor(level) {
  switch (level) {
    case 0:
      return "#22c55e";
    case 1:
      return "#facc15";
    case 2:
      return "#dc2626";
    default:
      return "#f0abfc";
  }
}

export default Map;
