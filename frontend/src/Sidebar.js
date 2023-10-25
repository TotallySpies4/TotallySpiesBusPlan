import { formatTime } from "./utils/utils.js";
import Select from "react-select";
import React, { useState } from "react";
import useFetch from "./hooks/useFetch.js";

const Sidebar = ({
  buses,
  busline,
  busOptions,
  isSidebarOpen,
  closeSidebar, selectedTrip
}) => {

  const handleBusSelection = (option) => {
    const bus = buses.find((b) => b.route_short_name === option.value);
    console.log("SelectedBusID: " + bus.route_id);
    busline(bus);
  };


  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Function to handle Apply button click
  const handleApply = () => {
    // Save or use the selected values as needed in your application logic
    // console.log("Selected Hour:", selectedHour);
    // console.log("Selected Minute:", selectedMinute);
    // console.log("Selected City:", selectedCity);
    //console.log("Selected Bus Line:", selectedBus);

    // Close the sidebar
    closeSidebar();
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="space-y-4">
        {/* Close Button */}
        <div className="flex justify-end">
          <button className="close-button" onClick={closeSidebar}>
            <div className="w-10 h-10">
              <img src="/icon/person.png" alt="Close" />{" "}
            </div>
          </button>
        </div>

        {/* Select City Dropdown */}
        <div className="space-y-4 w-full">
          <p>City</p>
          <Select
            // options={cityOptions}
            // onChange={(option) => {
            //     const city = cities.find(c => c.name === option.value);
            //     setSelectedCity(city);
            // }}
            // isSearchable
            // placeholder="Choose a city"
            placeholder="Bayern"
            className="w-full"
          />
        </div>

        {/* Bus line select dropdown and list */}
        <div className="space-y-4 w-full">
          <p>Bus line</p>
          <Select
            options={busOptions}
            onChange={handleBusSelection}
            isSearchable
            placeholder="Wählen Sie eine Buslinie..."
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

        {/* Predict Time Selection Dropdown
          <div className="flex space-x-2">
            // Hour Dropdown
            <div className="w-1/2">
              <p>Hour</p>
              <Select
                options={hours.map((hour) => ({ value: hour, label: hour }))}
                onChange={(option) => setSelectedHour(option.value)}
                value={{ value: selectedHour, label: selectedHour }}
                isSearchable
                placeholder="Hour"
              />
            </div>

            // Minute Dropdown
            <div className="w-1/2">
              <p>Minute</p>
              <Select
                options={minutes.map((minute) => ({
                  value: minute,
                  label: minute,
                }))}
                onChange={(option) => setSelectedMinute(option.value)}
                value={{ value: selectedMinute, label: selectedMinute }}
                isSearchable
                placeholder="Minute"
              />
            </div>
          </div> */}

        {/* Apply button  */}
        <button
          className="w-32 h-max-content p-4 flex items-center justify-center rounded-2xl bg-[#5A4BFF] text-center hover:bg-[#C2BEF6] hover:text-[#5A4BFF] text-[#FFFFFF]"
          onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
