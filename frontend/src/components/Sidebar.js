import React from "react";
import { CitySelection } from "./CitySelection.js";
import { BuslineSelection } from "./BuslineSelection.js";
import { SingleStationInfo } from "./SingleStationInfo.js";

export const Sidebar = ({
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
      } absolute top-12 left-0 p-3 w-96 h-3/4 z-50 bg-white overflow-y-hidden flex flex-col items-center rounded-r-xl shadow-2xl`}>
      <div className="space-y-4">
        <div>
          <CitySelection 
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />

          {/* Bus line select dropdown and list */}
            <BuslineSelection
              selectedCity={selectedCity}
              allroutes={allroutes}
              selectedTrip={selectedTrip}
              setSelectedBusline={setSelectedBusline}
            />
          </div>

          <SingleStationInfo
            selectedTrip={selectedTrip}
            // congestionStatus={congestionStatus}
            currentVehicle={currentVehicle}
          />
        </div>
      </div>
  );
};
