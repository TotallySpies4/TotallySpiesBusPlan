import React, {useEffect, useState} from "react";
import Select from "react-select";
import { SingleStationInfo } from "./SingleStationInfo.js";

export const BuslineSelection = ({
  selectedCity,
  setSelectedBusline,
  allroutes,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    setSelectedOption(null);
  }, [selectedCity]);
  let busOptions;

  const isSelectDisable = !selectedCity;

  // Define custom styles for the control
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: isSelectDisable ? "grey" : "#3b82f6",
      borderWidth: "2px",
      ":hover": {
        borderColor: isSelectDisable ? "grey" : "#3b82f6",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.selectProps.value === null ? "grey" : "#3b82f6",
    }),

    // Change the color of the dropdown button
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: isSelectDisable ? "grey" : "#3b82f6",
      ":hover": {
        color: isSelectDisable ? "grey" : "#3b82f6",
      },
    }),
  };

  if (selectedCity === "Amsterdam") {

    busOptions = allroutes.amsterdam.map((bus) => ({
      value: bus.route_short_name,
      label: (
        <div className ="busline-select">
          <strong>{bus.route_short_name}</strong>
          <p>{bus.route_long_name}</p>
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
    setSelectedOption(option)
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

    <div className="busline-selection sidebar-selection px-8 space-y-4 w-full">
      <div className=" ml-3 flex flex-row space-x-4 items-center">
        <img src="/icon/BusSelectIcon.png" alt="" className="icon-bus w-10 h-10" />

        <p className="text-[20px]">Bus line</p>
      </div>

      <Select value={selectedOption}
        options={busOptions}
        onChange={handleBusSelection}
        isSearchable 
        placeholder="-Choose a bus line-"
        // className="w-full-width"
        styles={customStyles}
        isDisabled={isSelectDisable}
      />

      {selectedCity && <SingleStationInfo />}
    </div>
  );
};