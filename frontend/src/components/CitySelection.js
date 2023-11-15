import Select from "react-select";
import React from "react";
export const CitySelection = ({selectedCity,setSelectedCity}) => {
    let cityOptions = ["Amsterdam", "Stockholm"]
    return (
        <div className="space-y-4 w-full">
            <p>City</p>
            <Select
                options={cityOptions}
                onChange={(option) => {
                    console.log(option);
                    //const city = option;
                    //setSelectedCity(city);
                }}
                isSearchable
                placeholder="Choose a city"
                className="w-full"
            />
        </div>
    );
}
