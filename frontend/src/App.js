import Map from './Map.js';
import React, {useEffect, useState} from 'react';
import Sidebar from "./Sidebar.js";
const App = () => {
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

      <Map selectedBus={selectedBus} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Sidebar buses={buses} selectedBus={selectedBus}
                 setSelectedBus={setSelectedBus} busOptions={busOptions}
                 isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default App;




