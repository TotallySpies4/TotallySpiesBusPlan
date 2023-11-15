import Map from "./components/Map.js";
import React, {useEffect, useState} from "react";
import Sidebar from "./components/Sidebar.js";
import useFetch from "./hooks/useFetch.js";

const App = () => {

    const url = "ws://localhost:4000";

    const [ws, setWs] = useState(null);
    const [buses, setBuses] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [congestionShape, setCongestionShape] = useState(null);
    useEffect(() => {
        console.log("SelectedBusID in App: " + selectedTrip)
    }, [selectedTrip, currentVehicle, congestionShape]);


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
                        console.log("testPayload:", busLineDetail.payload);
                        console.log("testPayload Current :", busLineDetail.payload.currentVehicle);
                        console.log("testPayload Trip :", busLineDetail.payload.trip);
                        console.log("testPayload Congestion :", busLineDetail.payload.congestionShape);
                        console.log("test:", selectedTrip);
                        setSelectedTrip(busLineDetail.payload.trip);
                        setCurrentVehicle(busLineDetail.payload.currentVehicle);
                        setCongestionShape(busLineDetail.payload.congestionShape);
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

    //const {buses, selectedTrip ,ws, sendRequest} = useFetch("ws://localhost:4000");
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
          selectedTrip={selectedTrip}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
          congestionShape={congestionShape}
            currentVehicle={currentVehicle}
      />
      <Sidebar
        buses={buses}
        selectedTrip={selectedTrip}
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




