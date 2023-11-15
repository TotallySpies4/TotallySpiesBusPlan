import { formatTime } from "../utils/utils.js";
import Select from "react-select";
import React, { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import {CitySelection} from "./CitySelection.js";
import {BusllineSelection} from "./BusllineSelection.js";

const Sidebar = ({
    allroutes,
    setSelectedBuslines,
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
          <BusllineSelection
              selectedCity ={selectedCity}
              allroutes={allroutes}
              selectedTrip={selectedTrip}
              setSelectedBuslines={setSelectedBuslines}
          />

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
