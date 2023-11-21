import React, { useState } from "react";
import Select from "react-select";
import { formatTime } from "../utils/formatTime.js";
import {SingleStationInfo} from "./SingleStationInfo.js";

export const BuslineSelection = ({
  selectedCity,
  setSelectedBusline,
  allroutes,
  congestionStatus,
  currentVehicle,
}) => {
  let busOptions;

  const isBuslineDisable = !selectedCity;
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: "#3b82f6",
      borderWidth: "2px",
      ":hover": {
        borderColor: "#3b82f6",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.selectProps.value === null ? "grey" : "#3b82f6",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#3b82f6",
      ":hover": {
        color: "#3b82f6",
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
    <div>
      <Select
        options={busOptions}
        onChange={handleBusSelection}
        isSearchable
        placeholder="-Choose a bus line-"
        className="w-full"
        styles={customStyles}
        disabled={isBuslineDisable}/>

      {selectedCity && <SingleStationInfo />}
    </div>
  );
};
