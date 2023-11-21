import React, { useState } from "react";
import Select from "react-select";
import { SingleStationInfo } from "./SingleStationInfo.js";

export const BuslineSelection = ({
  selectedCity,
  setSelectedBusline,
  allroutes,
  congestionStatus,
  currentVehicle,
}) => {
  let busOptions;

  const isButtonDisable = !selectedCity;

  // Define custom styles for the control
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: isButtonDisable ? "#9ca3af" : "#3b82f6",
      borderWidth: "2px",
      ":hover": {
        borderColor: isButtonDisable ? "#9ca3af" : "#3b82f6",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.selectProps.value === null ? "#9ca3af" : "#3b82f6",
    }),

    // Change the color of the dropdown button
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: isButtonDisable ? "#9ca3af" : "#3b82f6",
      ":hover": {
        color: isButtonDisable ? "#9ca3af" : "#3b82f6",
      },
    }),
  };

  if (selectedCity === "Amsterdam") {
    busOptions = allroutes.amsterdam.map((bus) => ({
      value: bus.route_short_name,
      label: (
        <div>
          <strong>{bus.route_short_name}</strong> {bus.route_long_name}
        </div>
      ),
    }));
  } else if (selectedCity === "Stockholm") {
    busOptions = allroutes.stockholm.map((bus) => ({
      value: bus.route_short_name,
      label: (
        <div>
          <strong>{bus.route_short_name}</strong> {bus.route_long_name}
        </div>
      ),
    }));
  }

  const handleBusSelection = (option) => {
    let bus;
    if (selectedCity === "Amsterdam") {
      bus = allroutes.amsterdam.find(
        (b) => b.route_short_name === option.value
      );
    } else if (selectedCity === "Stockholm") {
      bus = allroutes.stockholm.find(
        (b) => b.route_short_name === option.value
      );
    }
    setSelectedBusline(bus);
  };

  return (
    <div className="space-y-4 w-72">
      <div className="flex flex-row items-center">
        {/* <img src="/icon/bus-station.png" alt="" /> */}
        <p>Bus line</p>
      </div>

      <Select
        options={busOptions}
        onChange={handleBusSelection}
        isSearchable
        placeholder="-Choose a bus line-"
        className={`w-full ${customStyles}`}
        isDisabled={isButtonDisable}
      />

      {selectedCity && <SingleStationInfo />}
    </div>
  );
};
