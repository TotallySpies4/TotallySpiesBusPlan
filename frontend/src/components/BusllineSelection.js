import Select from "react-select";
import {formatTime} from "../utils/utils.js";
import React, {useEffect} from "react";

export const BusllineSelection = ({selectedCity,selectedTrip,setSelectedBuslines,allroutes}) => {
    let busOptions;


        if(selectedCity === "Amsterdam") {
            busOptions = allroutes.amsterdam.map((bus) => ({
                value: bus.route_short_name,
                label: bus.route_short_name + " - " + bus.route_long_name,
            }));
        } else if (selectedCity === "Stockholm") {
            busOptions = allroutes.stockholm.map((bus) => ({
                value: bus.route_short_name,
                label: bus.route_short_name + " - " + bus.route_long_name,
            }));
        }

    const handleBusSelection = (option) => {
        let bus;
        if(selectedCity === "Amsterdam") {
            bus = allroutes.amsterdam.find((b) => b.route_short_name === option.value);
        } else if (selectedCity === "Stockholm") {
            bus = allroutes.stockholm.find((b) => b.route_short_name === option.value);
        }
        console.log("SelectedBusID: " + bus.route_id);
        setSelectedBuslines(bus);
    };
    return (
        <div>
            <Select
                options={busOptions}
                onChange={handleBusSelection}
                isSearchable
                placeholder="Choose a bus line..."
                className="w-full"
            />

            {selectedTrip && selectedTrip.stop_times && (
                <div className="list">

                    <ul>
                        {selectedTrip.stop_times.map((stop, index) => (
                            <li key={index}>
                                {stop.stop_name} - {formatTime(stop.arrival_time)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

    );
}