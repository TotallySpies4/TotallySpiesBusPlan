import { formatTime } from "../utils/utils.js";
import Select from "react-select";
import React, { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import {CitySelection} from "./CitySelection.js";

const Sidebar = ({
    buses,
    busline,
    //busOptions,
    isSidebarOpen,
    selectedTrip,
    selectedCity,
    setSelectedCity,

}) => {
  const handleBusSelection = (option) => {
    const bus = buses.find((b) => b.route_short_name === option.value);
    console.log("SelectedBusID: " + bus.route_id);
    busline(bus);
  };

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
          <Select
            //options={busOptions}
            onChange={handleBusSelection}
            isSearchable
            placeholder="Choose a bus line..."
            className="w-full"
          />

          {selectedTrip && selectedTrip.stop_times && (
              <div className="list">

                <ul>
                  {selectedTrip.stop_times.map((stop, index) => (
                      <li key={index}>
                        {stop.stop_name} - {formatTime(stop.arrival_time)}
                      </li>
                  ))}
                </ul>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
