import React, {useEffect, useState} from "react";
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
  currentVehicle, tripUpdate
}) => {
  // const handleCloseSidebar = () => {
  //   closeSidebar();
  // };
  const [isBuslineSelectionOpen, setIsBuslineSelectionOpen] = useState(false);
  const [showSingleStationInfo, setShowSingleStationInfo] = useState(false);
const [totalStops, setTotalStops] = useState(null);

  useEffect(() => {
    setShowSingleStationInfo(false);
  }, [selectedCity]);

  useEffect(() => {
    if (selectedTrip) {
      setShowSingleStationInfo(true);
    }
  }, [selectedTrip]);


  const handleBuslineSelectionToggle = () => {
    setIsBuslineSelectionOpen((prevState) => !prevState);
  };




  // const sidebarHeight = selectedTrip  ? "h-3/4" : "h-fit";
  // const sidebarTop = selectedTrip ? "top-12" : "top-1/2 transform -translate-y-1/2";
  const sidebarDividerShadow = showSingleStationInfo ? "shadow-bottom" : "";

  return (
    <div
      className={`sidebar ${
        isSidebarOpen ? "open" : ""
      } absolute left-[10px] py-10 w-96 top-6 z-50 flex flex-col rounded-3xl shadow-lg`}>
      <div className="space-y-4">
        {/* City select dropdown and list */}
        <div className={`selections space-y-4 h-fit ${sidebarDividerShadow}`}>
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
        {showSingleStationInfo &&
        <SingleStationInfo
          className="stop-infos"
          selectedTrip={selectedTrip}
          currentVehicle={currentVehicle}
          tripUpdate={tripUpdate}
          setSelectedCity={setSelectedCity}
          totalStops={totalStops}
        />}
      </div>
    </div>
  );
};
