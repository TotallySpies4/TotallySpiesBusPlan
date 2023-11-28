import React from "react";
import { formatTime } from "../utils/formatTime.js";

export const SingleStationInfo = ({
  selectedTrip,
  congestionStatus,
  currentVehicle,
  congestionInfo,
}) => {
  return (
    selectedTrip &&
    selectedTrip.stop_times && (
      <div className="list" style={{ maxHeight: "300px", overflowY: "auto" }}>
        <ul>
          {selectedTrip.stop_times.map((stop, index) => (
            <li key={index}>
              <div className="flex flex-row justify-between items-center divide-y-2">
                <div>
                  <strong>{stop.stop_name}</strong>
                  <strong
                    style={
                      {
                        //color: getCongestionInfo(
                        //currentVehicle.congestion_level.level).color,
                      }
                    }>
                    {formatTime(stop.arrival_time)}
                  </strong>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

function getCongestionInfo(level) {
  switch (level) {
    case 1:
      return { status: "On time", color: "green" };
    case 2:
      return { status: "Maybe late", color: "orange" };
    case 3:
      return { status: "Late", color: "red" };
    default:
      return { status: "Bus is not in operation", color: "grey" };
  }
}
