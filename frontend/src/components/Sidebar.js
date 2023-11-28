import React, { useState } from "react";
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
  closeSidebar,
}) => {
  // const handleCloseSidebar = () => {
  //   closeSidebar();
  // };
  const [isBuslineSelectionOpen, setIsBuslineSelectionOpen] = useState(false);

  const handleBuslineSelectionToggle = () => {
    setIsBuslineSelectionOpen((prevState) => !prevState);
  };

  const sidebarHeight =
    selectedCity? "h-3/4" : "h-fit";
  // const sidebarHeight = selectedTrip  ? "h-3/4" : "h-fit";
  // const sidebarTop = selectedTrip ? "top-12" : "top-1/2 transform -translate-y-1/2";
  const sidebarDividerShadow = selectedTrip ? "shadow-bottom" : "";

  return (
    <div
      className={`sidebar ${
        isSidebarOpen ? "open" : ""
      } absolute top-12 left-2 py-10 w-96 ${sidebarHeight} z-50 bg-[#FFFF] overflow-hidden flex flex-col rounded-3xl shadow-lg divide-y-2`}>
      <div className="space-y-4">
        {/* <div className="flex justify-end px-8">
          <button className="close-button" onClick={handleCloseSidebar}>
            <div className="w-8 h-8">
              <img src="./icon/closebutton.png" alt="Close" />
            </div>
          </button>
        </div> */}
        {/* City select dropdown and list */}
        <div className={`h-fit ${sidebarDividerShadow}`}>
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
            isOpen={isBuslineSelectionOpen}
            onToggle={handleBuslineSelectionToggle}
          />
        </div>
      </div>

      <SingleStationInfo
        className="divide-x-2"
        selectedTrip={selectedTrip}
        // congestionStatus={congestionStatus}
        currentVehicle={currentVehicle}
      />
    </div>
  );
};
