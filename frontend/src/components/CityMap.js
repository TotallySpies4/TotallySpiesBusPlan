import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

function Map({ selectedTrip, congestionShape, currentVehicle, selectedCity, predictionTime, segmentSpeedPrediction }) {

  //Set default map center to Amsterdam
  const [mapCenter, setMapCenter] = useState([52.3676, 4.9041]);
  useEffect(() => {
    console.log("SelectedBusID in Map: " + selectedTrip);
    console.log("PredictionTime in Map was change: " + predictionTime)
    console.log("currentVehicle in Map: " + currentVehicle)
  }, [selectedTrip, predictionTime,currentVehicle]);

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
  }, [selectedCity])

const stopIcon = new L.icon({
  iconUrl: "/icon/bus.png",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
})

const busIcon = new L.icon({
  iconUrl: "/icon/busLocation.png",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
})

  const drawSegmentSpeedPrediction = () => {
    if (predictionTime !== "now") {
      return segmentSpeedPrediction
          .filter(segment => segment.shapes && segment.shapes.length > 0)
          .map((segment, segmentIndex) => {
            let level = segment[`speed_${predictionTime}_min_prediction`].level;
            let color = getCongestionColor(level === null ? 0 : level);

            const positions = segment.shapes
                .filter(shape => shape && shape.shape_pt_lat != null && shape.shape_pt_lon != null)
                .map(shape => new L.LatLng(shape.shape_pt_lat, shape.shape_pt_lon));

            return (
                <React.Fragment key={segmentIndex}>
                  <Polyline
                      positions={positions}
                      color={color}
                  />
                </React.Fragment>
            );
          });
    }
  };

  return (
    <div className="map">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100vh", width: "100vw" }}
        zoomControl={false}>
        <TileLayer
          url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=BTdIPPqKEPczbvNzaOq7YKmEhFiO71WOmYjwuBQWLZkXLSvJZIupQZF63M8hSn3B"
          // attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>'
        />
        {/* Drawing stopes and shapes */}

        {selectedTrip && (
          <Polyline
            positions={selectedTrip.shapes.map((shape) => [
              shape.shape_pt_lat,
              shape.shape_pt_lon,
            ])}
            color={!currentVehicle ? "#838383" : "#4FB453"}
            />
        )}

        {selectedTrip && !currentVehicle && (
          <div className="bus-message shadow-lg">
            <img src="/icon/info.png" alt="Info" className="bus-icon" />
            The bus is currently not in operation.
          </div>
        )}

        {selectedTrip &&
          selectedTrip.stop_times.map((stop, index) => (
            <Marker
              key={index}
              position={[stop.location.latitude, stop.location.longitude]}
              icon={stopIcon}>
              <Popup>
                <strong className="text-blue-500">{stop.stop_name}</strong>
                <br /> <strong>Arrival Time: </strong> {stop.arrival_time},
                <br /> <strong>Departure Time: </strong> {stop.departure_time}
              </Popup>
            </Marker>
          ))}

        {/* Drawing vehicle position */}
        {currentVehicle && (
          <Marker
          icon={busIcon}
            position={[
              currentVehicle.current_position.latitude,
              currentVehicle.current_position.longitude,
            ]}>
            <Popup>Bus Position</Popup>
          </Marker>
        )}

        {/* Drawing congestion shape */}
        {(predictionTime === "now" || !segmentSpeedPrediction) && congestionShape &&  (
          <Polyline
            positions={congestionShape.map((shape) => [
              shape.shape_pt_lat,
              shape.shape_pt_lon,
            ])}
            color={getCongestionColor(currentVehicle.congestion_level.level)}
          />
        )}
        {currentVehicle && predictionTime && segmentSpeedPrediction && drawSegmentSpeedPrediction()}
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
      return "#838383";
  }
}

export default Map;