import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

function Map({ selectedTrip, congestionShape, currentVehicle, selectedCity }) {

  //Set default map center to Amsterdam
  const [mapCenter, setMapCenter] = useState([52.3676, 4.9041]);
  useEffect(() => {
    console.log("SelectedBusID in Map: " + selectedTrip);
  }, [selectedTrip]);

  // Update map center based on the selected city
  const handleCityChange = () => {
    if (selectedCity === "Stockholm") {
      setMapCenter([59.3293, 18.0686]); // Set center for Stockholm
    } else if (selectedCity === "Amsterdam") {
      setMapCenter([52.3676, 4.9041]); // Reset center for Amsterdam
    }
  };

  React.useEffect(() => {
    // Handle initial city change
    handleCityChange();
  }, [selectedCity]);
  
const customIcon = new L.icon({
  iconUrl: "/icon/BusMarker.png",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
})
  return (
    <div className="map">
      <MapContainer
        center={mapCenter}
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
            color={currentVehicle ? "#4FB453" : "#CE2273"}
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
              position={[stop.location.latitude, stop.location.longitude]}
              icon={customIcon}>
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
      return "#4FB453";
    case 1:
      return "#EAB059";
    case 2:
      return "#B44F4F";
    default:
      return "#CE2273";
  }
}

export default Map;
