import Map from "./Map.js";
import React, {useEffect, useState} from "react";
import Sidebar from "./Sidebar.js";
import useFetch from "./hooks/useFetch.js";

const App = () => {

    const url = "ws://localhost:4000";

    const [ws, setWs] = useState(null);
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    useEffect(() => {
        console.log("SelectedBusID in App: " + selectedBus)
    }, [selectedBus]);


    useEffect(() => {
        const wsInstance = new WebSocket(url);
        setWs(wsInstance);

        wsInstance.onopen = () => {
            console.log("Connected to the websocket");
        };

        wsInstance.onmessage = (event) => {
            if(event.data === "Hello from server!") {
                console.log(event.data);
            } else {
                const data = JSON.parse(event.data);

                if (data.type === 'ALL_BUS_LINES') {
                    try {
                        const allBusLine = JSON.parse(event.data);
                        console.log(allBusLine.payload);
                        setBuses(allBusLine.payload);


                    } catch (error) {
                        console.error("Error parsing the incoming data:", error);
                    }
                } else if (data.type === 'BUS_LINE_DETAILS') {
                    try {
                        const busLineDetail = JSON.parse(event.data);
                        console.log(busLineDetail);
                        console.log("testPayload:", busLineDetail.payload[0].stop_times[0].location);
                        setSelectedBus(busLineDetail.payload[0]);
                        console.log("test:", selectedBus);
                    } catch (error) {
                        console.error("Error parsing the incoming data:", error);
                    }
                }
            }
        };

        wsInstance.onclose = () => {
            console.log("Disconnected from the websocket");
        };
        return () => {
            ws.close();
        }
    }, [url]);
    const sendRequest = (message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    };

    //const {buses, selectedBus ,ws, sendRequest} = useFetch("ws://localhost:4000");
    const [busLine, setBusLine] = useState(null);
    useEffect(() => {
        if (busLine){
            console.log("SelectedBusID in App: " + busLine.route_id)
            sendRequest(JSON.stringify({type: "GET_BUS_LINE_DETAILS", payload: {routeId: busLine.route_id}}));
    }}, [busLine]);

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const busOptions = buses.map((bus) => ({
        value: bus.route_short_name,
        label: bus.route_short_name + " - " + bus.route_long_name,
  }));

  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  return (
    <div className="container">
      <Map
        selectedBus={selectedBus}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar
        buses={buses}
        selectedBus={selectedBus}
        busline={setBusLine}
        busOptions={busOptions}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        ws={ws}
      />
    </div>
  );
};

export default App;




