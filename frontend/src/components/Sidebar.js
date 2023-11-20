import { formatTime } from "../utils/utils.js";
import Select from "react-select";
import React, { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import {CitySelection} from "./CitySelection.js";
<<<<<<< HEAD
import {BuslineSelection} from "./BuslineSelection.js";
=======
import BuslineSelection from "./BuslineSelection.js";
>>>>>>> dd48194e36c008cfdb2a433796acbb8078f23d93

const Sidebar = ({
    allroutes,
    setSelectedBusline,
    isSidebarOpen,
    selectedTrip,
    selectedCity,
    setSelectedCity,

}) => {


  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="space-y-4">

        <CitySelection
            selectedCity ={selectedCity}
            setSelectedCity={setSelectedCity}
        />

        {/* Bus line select dropdown and list */}
        <div className="space-y-4 w-full">
          <p>Bus line</p>
          <BuslineSelection
              selectedCity ={selectedCity}
              allroutes={allroutes}
              selectedTrip={selectedTrip}
             setSelectedBusline={setSelectedBusline}
          />

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
