import React, { useState } from "react";
import Select from "react-select";
import {BuslineSelection} from "./BuslineSelection.js";
import {  CitySelection } from "./CitySelection.js";

export const PredictionDropDown = ({ selectedBusline, selectedCity }) => {
  // const [selectTime, setSelectTime] = useState(null);
  const isButtonDisable = !selectedCity || !selectedBusline;
  
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: isButtonDisable ? "grey":  "#3b82f6",
      borderWidth: "2px",
      ":hover": {
        borderColor: isButtonDisable ? "grey": "#3b82f6",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.selectProps.value === null ? "grey" : "#3b82f6",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: isButtonDisable ? "grey": "#3b82f6",
      ":hover": {
        color: isButtonDisable ? "grey":"#3b82f6",
      },
    }),
  };
  return (
    <div className="flex flex-row justify-around items-center w-96 bg-[#FFF] drop-shadow-xl rounded-2xl px-2">
      <p>Congestion in</p>
      {/* Dropdown for time options */}
      <div className="rounded-lg w-full">
        <Select
          name="time-options"
          type="button"
          disabled={isButtonDisable}
          placeholder="-Choose predict time-"
          className={`py-2 px-4 w-48 ${customStyles}`}
          onClick={() => {
            console.log("Clicked"); 
          }}
         
          options={[
            { value: "now", label: "Now" },
            { value: 30, label: "30 mins" },
            { value: 60, label: "60 mins" },
            { value: 120, label: "120 mins" },
          ]}
          onChange={(option) => {
            console.log(option);
            // const time = option.value;
          }}
          // onChange={(option) => {
          //   console.log(option);
          //   // const time = option.value;
          // }}
        />
      </div>
    </div>
  );
};

export default PredictionDropDown;

