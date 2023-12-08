import Map from "./components/CityMap.js";
import React, { useEffect, useState } from "react";
import {Sidebar} from "./components/Sidebar.js";
import useFetch from "./hooks/useFetch.js";
import { ReroutingButton } from "./components/ReroutingButton.js";
import { PredictionDropDown } from "./components/PredictionDropdown.js";
const App = () => {
  const url = "ws://localhost:4000";

  const [ws, setWs] = useState(null);
  const [allroutes, setAllroutes] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [congestionShape, setCongestionShape] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBusline, setSelectedBusline] = useState(null);
    const [congestionStatus, setCongestionStatus] = useState(null);
const [isReroutingPressed, setReroutingPressed] = useState(false);
  useEffect(() => {
    console.log("SelectedBusID in App: " + selectedTrip);
    console.log("SelectedCity in App: " + selectedCity);
  }, [selectedTrip, currentVehicle, congestionShape, selectedCity]);

  useEffect(() => {
  if (selectedBusline) {
  console.log("SelectedBusID in App: " + selectedBusline.route_id);
  sendRequest(
  JSON.stringify({
  type: "GET_BUS_LINE_DETAILS",
  payload: { routeId: selectedBusline.route_id },
  })
  );
  }
  }, [selectedBusline]);

  useEffect(() => {
  const wsInstance = new WebSocket(url);
  setWs(wsInstance);

  wsInstance.onopen = () => {
  console.log("Connected to the websocket");
  };

  wsInstance.onmessage = (event) => {
  if (event.data === "Hello from server!") {
  console.log(event.data);
  } else {
  const data = JSON.parse(event.data);

  if (data.type === "ALL_BUS_LINES") {
  try {
  const allBusLine = JSON.parse(event.data);
  console.log(allBusLine.payload);
  setAllroutes(allBusLine.payload);
  } catch (error) {
  console.error("Error parsing the incoming data:", error);
  }
        } else if (data.type === "BUS_LINE_DETAILS") {
  try {
  const busLineDetail = JSON.parse(event.data);
  console.log(busLineDetail);
  console.log("testPayload:", busLineDetail.payload);
  console.log(
  "testPayload Current :",
  busLineDetail.payload.currentVehicle
  );
  console.log("testPayload Trip :", busLineDetail.payload.trip);
  console.log(
  "testPayload Congestion :",
  busLineDetail.payload.congestionShape
  );
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
  };
  }, [url]);
  const sendRequest = (message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
  ws.send(message);
  }
  };

  //const {buses, selectedTrip ,ws, sendRequest} = useFetch("ws://localhost:4000");

  return (
    <div className="container">
      <Map
        selectedTrip={selectedTrip}
        congestionShape={congestionShape}
        currentVehicle={currentVehicle}
              />
      <Sidebar
        allroutes={allroutes}
        selectedTrip={selectedTrip}
        setSelectedBusline={setSelectedBusline}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        congestionStatus={congestionStatus}
        currentVehicle={currentVehicle}
      />

      <div className="prediction absolute top-2 transform -translate-x-1/2 flex flex-row items-center space-x-4">

        <PredictionDropDown
          // isButtonDisabled = {isButtonDisabled}
          selectedCity={selectedCity}
          selectedBusline={selectedBusline}
        />
      </div>
    </div>
  );
};

export default App;