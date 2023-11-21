import React, { useEffect , useState} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

function Map({ selectedTrip, congestionShape, currentVehicle , selectedCity}) {
  const [viewport, setViewport] = useState({
    latitude: 52.3676,
    longitude: 4.9041,
    zoom: 13,
  });
  useEffect(() => {
    if (selectedCity === "Stockholm") {
      setViewport({
        latitude: 59.3293,
        longitude: 18.0686,
        zoom: 13,
      });
    } else {
      setViewport({
        latitude: 52.3676,
        longitude: 4.9041,
        zoom: 13,
      });
    }
  }, [selectedCity]);

  useEffect(() => {
    console.log("SelectedBusID in Map: " + selectedTrip);
  }, [selectedTrip]);

  return (
    <div className="map">
      <MapContainer
        center={[viewport.latitude, viewport.longitude]}
        zoom={viewport.zoom}
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
            color={currentVehicle ? "green" : "grey"}
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
      return "green";
    case 1:
      return "orange";
    case 2:
      return "red";
    default:
      return "grey";
  }
}

export default Map;