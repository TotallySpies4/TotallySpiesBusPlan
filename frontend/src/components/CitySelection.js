import Select from "react-select";
import React, { useState } from "react";

export const CitySelection = ({ setSelectedCity }) => {
  let cityOptions = ["Amsterdam", "Stockholm"].map((city) => ({
    value: city,
    label: city,
  }));

  const [selectedCity, setSelectedCityState] = useState(null);

  // Define custom styles for the control
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: "#3b82f6",
      borderWidth: "2px",
      ':hover': {
        borderColor: "#3b82f6",
      }, 
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.selectProps.value === null ? "grey" : "#3b82f6",
    }),
    // Remove the divider
    menu: (provided, state) => ({
      ...provided,
      borderWidth: 0,
    }),
    // Change the color of the dropdown button
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: "#3b82f6",
        ':hover': {
          color: "#3b82f6", // Set the hover color to the same as the normal color
        },
      }),
  };

  return (
    <div className="space-y-4 w-72">
      <div className="flex flex-row items-center">
        <img src="./public/CitySelection.png" alt="" />
        <p>City</p>
      </div>

      <Select
        options={cityOptions}
        value={selectedCity}
        onChange={(option) => {
          console.log(option);
          const city = option.value;
          setSelectedCity(city);
          setSelectedCityState(option);
        }}
        // isSearchable
        placeholder="-Select a city-"
        className="w-full"
        styles={customStyles}
      />
    </div>
  );
};