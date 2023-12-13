import React, { useMemo } from "react";
import { formatTime } from "../utils/formatTime.js";
import moment from "moment-timezone";

export const SingleStationInfo = ({
  selectedTrip,
  tripUpdate,
  setSelectedCity,
  currentVehicle,
}) => {
  // Set timezone
  const cityToTimeZone = {
    Amsterdam: "Europe/Amsterdam",
    Stockholm: "Europe/Stockholm",
  };

  const formatScheduledTime = (timeStr) => {
    return timeStr.substring(0, 5);
  };

  const formatTime = (timestamp) => {
    const tz = cityToTimeZone[setSelectedCity] || "UTC";
    return moment(timestamp * 1000)
      .tz(tz)
      .add(1, "hours")
      .format("HH:mm");
  };

  const formatDelay = (delay) => {
    if (delay > 0) {
      const delayMinutes = Math.floor(delay / 60);
      return `Delay ${delayMinutes} min`;
    }
    return "On time";
  };

  const isDelayedCheck = (delay) => {
    const delayMinutes = Math.floor(delay / 60);
    if (delayMinutes > 0) {
      return true;
    }
  };

  const stopCoordinates = useMemo(
    () =>
      selectedTrip
        ? selectedTrip.stop_times.map((stop) => ({
            latitude: stop.location.latitude,
            longitude: stop.location.longitude,
          }))
        : [],
    [selectedTrip]
  );

  const Dot = ({ coordinates }) => (
    <div
      className="dot"
      value ={stopCoordinates}
      style={{
        position: "absolute",
        // left: ${coordinates.longitude * 20}px, // Adjust as needed for visualization
        // top: ${coordinates.latitude * 20}px, // Adjust as needed for visualization
        width: "8px",
        height: "8px",
        backgroundColor: currentVehicle ? "blue" : "grey", // Set your desired dot color
        borderRadius: "100%",
      }}></div>
  );


  return (
    <div className="stop-list w-96">
      {selectedTrip &&
        selectedTrip.stop_times.map((stop, index) => {
          const stopUpdate = tripUpdate
            ? tripUpdate.find(
                (update) => update.stopSequence === stop.stop_sequence
              )
            : null;
          console.log("Update", stopUpdate);
          const isDelayed = stopUpdate
            ? isDelayedCheck(stopUpdate.arrival.delay)
            : false;
          console.log("isDelayed", isDelayed);
          const scheduledTimeStr = formatScheduledTime(stop.arrival_time);
          const actualTimeStr = isDelayed
            ? formatTime(stopUpdate.arrival.time)
            : "";
          const delayStr = stopUpdate
            ? isDelayed
              ? formatDelay(stopUpdate.arrival.delay)
              : "On time"
            : "On time";

          return (
            <div key={index} className="stop-item">
              <div className="stop-info">
              <Dot coordinates={stopCoordinates[index]} className = "stop-dot" />
                <div className="stop-item-left">
                  <div className="stop-name">{stop.stop_name}</div>
                  <div
                    className={`delay-info ${
                      isDelayed ? "delayed" : "ontime"
                    } ${!currentVehicle ? "not-operating" : ""}`}>
                    {!currentVehicle?"Currently not in operation":delayStr}
                  </div>
                </div>
                <div className="arrival-info">
                  <div
                    className={`scheduled-time ${
                      isDelayed ? "strike-through" : "ontime"
                    } ${!currentVehicle ? "not-operating" : ""}`}>
                    {scheduledTimeStr}
                  </div>
                  {isDelayed && (
                    <div className="actual-time">{actualTimeStr}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SingleStationInfo; 