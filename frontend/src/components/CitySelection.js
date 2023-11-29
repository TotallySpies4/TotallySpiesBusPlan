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
      borderColor: !selectedCity? "grey": "#3b82f6",
      borderWidth: "2px",
      ':hover': {
        borderColor: "#3b82f6",
      }, 
      ':focus':{
        borderColor: "#3b82f6"
      }
    }),

    singleValue: (provided, state) => ({
      ...provided,
      color: state.selectProps.value === null ? "#9ca3af" : "#3b82f6",
    }),

    // Change the color of the dropdown button
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: !selectedCity? "grey": "#3b82f6"
      }),
  };

  const handleChange = (option) => {
    setSelectedCityState(option);
    const city = option.value;
    setSelectedCity(city); // Directly update the selectedCity state
  };

  return (
    <div className="space-y-4 px-8 w-full">
      <div className="ml-3 space-x-4 flex flex-row items-center">
        <img src="/icon/CitySelection.png" alt=""  />
        <p className="text-[20px]">City</p>
      </div>

      <Select
        options={cityOptions}
        value={selectedCity}
        onChange={handleChange}
        isSearchable
        placeholder="-Select a city-"
        className="w-full-width"
        styles={customStyles}
      />
    </div>
  );
};
