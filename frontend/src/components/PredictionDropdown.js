import React, {useEffect, useState} from "react";
import Select from "react-select";

export const PredictionDropDown = ({ selectedBusline, selectedCity, setPredictionTime, currentVehicle}) => {
  const [selectedOption, setSelectedOption] = useState({ value: "now", label: "Now" });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    useEffect(() => {
        setPredictionTime("now");
        setSelectedOption({ value: "now", label: "Now" });
        setIsButtonDisabled(!selectedCity || !selectedBusline || !currentVehicle);
    }, [selectedBusline, selectedCity, currentVehicle]);



    const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: isButtonDisabled ? "grey":  "#3b82f6",
      borderWidth: "2px",
      ":hover": {
        borderColor: isButtonDisabled ? "grey": "#3b82f6",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.selectProps.value === null ? "grey" : "#3b82f6",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: isButtonDisabled ? "grey": "#3b82f6",
      ":hover": {
        color: isButtonDisabled ? "grey":"#3b82f6",
      },
    }),
  };
  return (
      <div className="flex flex-row justify-around items-center w-[400px] bg-[#FFF] shadow-2xl rounded-full px-4">
        <p className="p-prediction w-fit text-[19px]" >Congestion in</p>

        {/* Dropdown for time options */}
        <Select
            name="time-options"
            type="button"
            isDisabled={isButtonDisabled}
            placeholder="now"
            className={`rounded-full text-center py-2 ${customStyles}`}
            value={selectedOption}
            options={[
              { value: "now", label: "Now" },
              { value: 30, label: "30 mins" },
              { value: 60, label: "60 mins" },
              { value: 120, label: "120 mins" },
            ]}
            onChange={(option) => {
              setSelectedOption(option);
              setPredictionTime(option.value);
            }}
        />
      </div>
  );
};