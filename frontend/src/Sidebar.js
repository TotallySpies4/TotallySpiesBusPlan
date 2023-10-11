import {formatTime} from "./utils/utils.js";
import Select from "react-select";
import React, {useState} from "react";

const Sidebar = ({buses,selectedBus,setSelectedBus, busOptions, isSidebarOpen}) => {

    return(
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <h2>Select a Bus Line</h2>
            <Select
                options={busOptions}
                onChange={(option) => {
                    // Hier können Sie die ausgewählte Buslinie festlegen
                    const bus = buses.find(b => b.route_short_name === option.value);
                    setSelectedBus(bus);

                }}
                isSearchable
                placeholder="Wählen Sie eine Buslinie..."
            />

            {selectedBus && (<div className="list">
                <h3>Stops for the Busline {selectedBus.route_short_name}</h3>
                <ul>
                    {selectedBus.stop_times.map((stop, index) => (
                        <li key={index}>{stop.stop_name} - {formatTime(stop.arrival_time)}</li>
                    ))}
                </ul>
            </div>)}

        </div>
    );
}

export default Sidebar;