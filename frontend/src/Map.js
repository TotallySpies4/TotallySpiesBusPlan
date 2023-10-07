import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';

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
              <button key={bus.id} onClick={() => setSelectedBus(bus)}>
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
          {selectedBus && selectedBus.stops.map(stop => (
              <Marker key={stop._id} position={[stop.latitude, stop.longitude]}>
                <Popup>{stop.name}</Popup>
              </Marker>
          ))}
        </MapContainer>
      </div>

  );
};

export default Map;