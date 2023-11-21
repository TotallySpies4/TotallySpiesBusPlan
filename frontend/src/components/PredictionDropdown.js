import React, { useState } from "react";
import Select from "react-select";


export const PredictionDropDown = ({ selectedBusline, selectedCity }) => {
  // const [selectTime, setSelectTime] = useState(null);
  const isButtonDisabled = !selectedCity || !selectedBusline;

  return (
    <div className="flex flex-row justify-around items-center w-96 bg-[#FFF] drop-shadow-xl rounded-2xl px-2">
      <p>Congestion in</p>
      {/* Dropdown for time options */}
      <div className="rounded-lg w-48">
        <Select
          name="time-options"
          defaultValue="now"
          type="button"
          disabled={isButtonDisabled}
          className={`py-2 px-4 rounded ${
            isButtonDisabled
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
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
          isSearchable
        />
      </div>
    </div>
  );
};

export default PredictionDropDown;
