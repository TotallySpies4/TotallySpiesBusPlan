import { formatTime } from "../utils/formatTime.js";
import Select from "react-select";
import React, { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { CitySelection } from "./CitySelection.js";
import BuslineSelection from "./BuslineSelection.js";
import SingleStationInfo from "./SingleStationInfo.js";

const Sidebar = ({
  allroutes,
  setSelectedBusline,
  isSidebarOpen,
  selectedTrip,
  selectedCity,
  setSelectedCity,
  congestionStatus,
  currentVehicle,
}) => {
  return (
    <div
      className={`sidebar ${
        isSidebarOpen ? "open" : ""
      } absolute top-12 left-0 p-10 w-96 h-3/4 z-50 bg-white bg-opacity-80 overflow-y-auto flex flex-col items-center rounded-lg shadow-lg`}>
      <div className="space-y-4">
        <CitySelection
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />

        {/* Bus line select dropdown and list */}
        <div className="space-y-4 w-full">
          <p>Bus line</p>
          <BuslineSelection
            selectedCity={selectedCity}
            allroutes={allroutes}
            selectedTrip={selectedTrip}
            setSelectedBusline={setSelectedBusline}
          />
          <SingleStationInfo
            selectedTrip={selectedTrip}
            congestionStatus={congestionStatus}
            currentVehicle={currentVehicle}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
