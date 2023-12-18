import React, { useEffect, useState } from "react";
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
  currentVehicle,
  tripUpdate,
}) => {
  const [isBuslineSelectionOpen, setIsBuslineSelectionOpen] = useState(false);
  const [showSingleStationInfo, setShowSingleStationInfo] = useState(false);
  const [predictionTime, setPredictionTime] = useState("now");

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
        {showSingleStationInfo && (
          <SingleStationInfo
            className="stop-infos"
            selectedTrip={selectedTrip}
            currentVehicle={currentVehicle}
            tripUpdate={tripUpdate}
            setSelectedCity={setSelectedCity}
            predictionTime={predictionTime}
            statusLineColor={
              !currentVehicle
                ? "#aeb0af"
                : predictionTime !== "now"
                ? "#2596FF"
                : currentVehicle.congestion_level.level === 0
                ? "#88c36c"
                : currentVehicle.congestion_level.level === 1
                ? "#f5b873"
                : currentVehicle.congestion_level.level === 2
                ? "#ff7070"
                : "#88c36c"
            }
          />
        )}
      </div>
    </div>
  );
};
