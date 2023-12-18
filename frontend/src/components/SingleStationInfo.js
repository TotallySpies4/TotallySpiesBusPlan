import React, { useMemo } from "react";
import { formatTime } from "../utils/formatTime.js";
import moment from "moment-timezone";

export const SingleStationInfo = ({
  selectedTrip,
  tripUpdate,
  setSelectedCity,
  currentVehicle,
  predictionTime,
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

  const Dot = ({ coordinates, hasNextStop, isLastStop, statusLineColor }) => {
    return (
      // Status line for displaying bus congestion level in the sidebar.
      <div className="status-display" style={{ position: "relative" }}>
        {hasNextStop && (
          <div
            className="status-line"
            style={{
              width: "10px",
              top: "35px",
              height: isLastStop ? "35px" : "70px",
              backgroundColor:isLastStop? "transparent":statusLineColor || (currentVehicle?"blue":"grey"),
              position: "relative",
              zIndex: 2,
            }}
          />
        )}

        {/* Displaying bus stop on the status line */}
        <div
          className={`dot ${currentVehicle}`}
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: currentVehicle ? "white" : "#dbdcdc",
            position: "relative",
            borderRadius: "100%",
            top: "50%",
            bottom: "50%",
            transform: "translate(-100%)",
            zIndex: 3,
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
          }}
        />
      </div>
    );
  };

  return (
    <div className="stop-list w-96">
      {selectedTrip &&
        selectedTrip.stop_times.map((stop, index) => {
          const hasNextStop = index <= selectedTrip.stop_times.length - 1;
          const isLastStop = index === selectedTrip.stop_times.length - 1;
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
            <div key={index} className="single-info">
              <div className="moving-component">
                <Dot
                  coordinates={stopCoordinates[index]}
                  isLastStop={isLastStop}
                  hasNextStop={hasNextStop}
                  statusLineColor={
                      !currentVehicle
                      ? "#aeb0af"
                      : predictionTime !== "now"
                      ? "#2596FF"
                      : currentVehicle.congestion_level.level === 0
                      ? "#88c36c"
                      : currentVehicle.congestion_level.level === 1
                      ? "#f5b873"
                      : currentVehicle.congestion_level.level === 2 || isDelayed
                      ? "#ff7070"
                      : "#88c36c"
                  }
                  className="stop-dot"
                />
              </div>
              <div key={index} className="stop-item">
                <div className="stop-info">
                  <div className="stop-item-left">
                    <div className="stop-name">{stop.stop_name}</div>
                    <div
                      className={`delay-info ${
                        isDelayed ? "delayed" : "ontime"
                      } ${!currentVehicle ? "not-operating" : ""}`}>
                      {!currentVehicle
                        ? "Currently not in operation"
                        : delayStr}
                    </div>
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
