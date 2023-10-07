import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {formatTime} from "./utils/utils.js";
import Select from "react-select";

const Map = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const busOptions = buses.map(bus => ({
    value: bus.route_short_name,
    label: bus.route_short_name + " - " + bus.route_long_name
  }));

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');

    ws.onopen = () => {
      console.log('Connected to the websocket');
    };

    ws.onmessage = (event) => {
      if (event.data === 'Hello from server!') {
        console.log(event.data); // Bestätigungsnachricht loggen
      } else {
        try {
          const busesData = JSON.parse(event.data);
          console.log(busesData);
          setBuses(busesData);
        } catch (error) {
          console.error("Error parsing the incoming data:", error);
        }
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from the websocket');
    };

    // Bereinigung beim Verlassen der Komponente
    return () => {
      ws.close();
    };
  }, []);

  return (
      <div className="container">
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <h2>Select a Bus Line</h2>
          <Select
              options={busOptions}
              onChange={(option) => {
                // Hier können Sie die ausgewählte Buslinie festlegen
                const bus = buses.find(b => b.route_short_name === option.value);
                setSelectedBus(bus);
              }}
              isSearchable
              placeholder="Wählen Sie eine Buslinie..."
          />
          {selectedBus && (<div className="list">
            <h3>Stops for the Busline {selectedBus.route_short_name}</h3>
            <ul>
              {selectedBus.stop_times.map((stop, index) => (
                  <li key={index}>{stop.stop_name} - {formatTime(stop.arrival_time)}</li>
              ))}
            </ul>
          </div>)}

        </div>
        <MapContainer
            center={[52.520008, 13.404954]}
            zoom={13}
            style={{ height: '100vh', width: '100vw' }}
        >
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            Toggle Sidebar
          </button>
          <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedBus && selectedBus.stop_times.map(stopTime => (
              <Marker
                  key={stopTime.stop_id}
                  position={[stopTime.location.latitude, stopTime.location.longitude]}
              >
                <Popup>
                  {stopTime.stop_name} - {stopTime.arrival_time.slice(0, -3)}
                </Popup>
              </Marker>
          ))}
        </MapContainer>

      </div>

  );
};

export default Map;