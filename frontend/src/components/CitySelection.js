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

  return (
    <div className="space-y-4 px-4 w-full">
      <div className="flex flex-row items-center">
        {/* <img src="/icon/CitySelection.png" alt="" /> */}
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
        isSearchable
        placeholder="-Select a city-"
        className="w-full-width"
        styles={customStyles}
      />
    </div>
  );
};
