import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {formatTime} from "./utils/utils.js";

const Map = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

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
      <div>
        <div>
          <h2>Select a Bus Line</h2>
          {buses.map(bus => (
              <button className="BusButton" key={bus._id} onClick={() => setSelectedBus(bus)}>
                {bus.route_short_name}
              </button>
          ))}
        </div>
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: '100vh', width: '100vw' }}
        >
          <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
        {selectedBus && (<div className="list">
          <h3>Stops for the Busline {selectedBus.route_short_name}</h3>
          <ul>
            {selectedBus.stop_times.map((stop, index) => (
                <li key={index}>{stop.stop_name} - {formatTime(stop.arrival_time)}</li>
            ))}
          </ul>
        </div>)}
      </div>

  );
};

export default Map;