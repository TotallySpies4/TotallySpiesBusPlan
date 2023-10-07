import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';

const Map = () => {
  const [busstops, setBusstops] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');

    ws.onopen = () => {
      console.log('Connected to the websocket');
    };

    ws.onmessage = (event) => {
        console.log('Received message from server: ', event.data);
      /*const busstopsData = JSON.parse(event.data);
      setBusstops(busstopsData);*/
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
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: '100vh', width: '100vw' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {busstops.map(busstop => (
          <Marker key={busstop._id} position={[busstop.latitude, busstop.longitude]}>
            <Popup>{busstop.name}</Popup>
          </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;