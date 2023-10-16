import { MapContainer, Marker, Popup, Polyline, TileLayer } from "react-leaflet";
import L from 'leaflet';
import 'leaflet-polylinedecorator';
import PolylineDecorator from "./PolylineDecorator.js";

const Map = ({ selectedBus, setSidebarOpen, isSidebarOpen }) => {
  return (
    <div className="map">
      <MapContainer
        center={[48.137154, 11.576124]}
        zoom={13}
        style={{ height: "100vh", width: "100vw" }}
        zoomControl={false}>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!isSidebarOpen)}>
          {!isSidebarOpen && (
            <div className="w-24 h-24">
              <img src="/icon/bus-station.png" alt="Filter bus line" />
            </div>
          )}
        </button>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedBus && selectedBus.stop_times.map((stopTime) => (
            <Marker
              key={stopTime.stop_id}
              position={[
                stopTime.location.latitude,
                stopTime.location.longitude,
              ]}>
              <Popup>
                {stopTime.stop_name} - {stopTime.arrival_time.slice(0, -3)}
              </Popup>
            </Marker>
          ))}

            {selectedBus && selectedBus.routeCoordinates && (
                <>
                    <Polyline
                        positions={selectedBus.routeCoordinates.map(stopTime => [stopTime.latitude, stopTime.longitude])}
                        color='blue'
                    />
                    <PolylineDecorator
                        positions={selectedBus.routeCoordinates.map(stopTime => [stopTime.latitude, stopTime.longitude])}
                        patterns={[
                            { offset: '10%', repeat: '20%', symbol: L.Symbol.arrowHead({ pixelSize: 10, pathOptions: { fillOpacity: 1, weight: 0 } }) }
                        ]}
                    />
                </>

            )}
        </MapContainer>

      </div>

  );
};

export default Map;
