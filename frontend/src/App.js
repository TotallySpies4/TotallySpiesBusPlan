import Map from './Map.js';
import React, { useEffect } from 'react';
const App = () => {
    useEffect(() => {
        const ws = new WebSocket('ws://backend:5000');

        ws.onopen = () => {
            console.log('Connected to server');
        };

        ws.onmessage = (message) => {
            console.log(`Received: ${message.data}`);
        };

        ws.onclose = () => {
            console.log('Disconnected from server');
        };

        return () => {
            ws.close();
        };
    }, []);
  return (
    <div>
      <Map />
    </div>
  );
};

export default App;




