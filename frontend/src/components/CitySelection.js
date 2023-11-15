import Select from "react-select";
import React from "react";
export const CitySelection = ({setSelectedCity}) => {
    let cityOptions = ["Amsterdam", "Stockholm"].map(city => ({ value: city, label: city }));

    return (
        <div className="space-y-4 w-full">
            <p>City</p>
            <Select
                options={cityOptions}
                onChange={(option) => {
                    console.log(option);
                    const city = option.value;
                    setSelectedCity(city);
                }}
                isSearchable
                placeholder="Choose a city"
                className="w-full"
            />
        </div>
    );
}
