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
      // return Delay ${delayMinutes} min;
      return delayMinutes;
    }
    return "On time";
  };

  const isDelayedCheck = (delay) => {
    const delayMinutes = Math.floor(delay / 60);
    if (delayMinutes > 0) {
      return true;
    }
  };

  const stopNo = selectedTrip
    ? selectedTrip.stop_times.map((stop) => ({
        stopNo: stop.stop_sequence,
      }))
    : [];

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
  const busCoordinates = useMemo(() => {
    return selectedTrip &&
      selectedTrip.vehiclepositions &&
      selectedTrip.vehiclepositions.current_position
      ? {
          latitude: selectedTrip.vehiclepositions.current_position.latitude,
          longitude: selectedTrip.vehiclepositions.current_position.longitude,
        }
      : null;
  }, [selectedTrip]);

  const Dot = ({ stopCoordinates, coordinates, stopNo, hasNextStop, isLastStop }) => {
    const isBusOnStop =
      busCoordinates &&
      busCoordinates.latitude === coordinates.latitude &&
      busCoordinates.longitude === coordinates.longitude;
    return (
      <div className="status-line">
        {hasNextStop && (
          <div
            className="line"
            style={{
              width: "10px",
              top:"35px",
              height: "70px",
              backgroundColor: !currentVehicle
                ? "#aeb0af"
                : currentVehicle.congestion_level.level === 1
                ? "#88c36c"
                : currentVehicle.congestion_level.level === 2
                ? "#fced83"
                : "#ff7070",
              position: "relative",
              zIndex: 1,
            }}></div>
        )}
        <div
          className={`dot ${currentVehicle && isBusOnStop ? "pulse" : ""}`}
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: currentVehicle ? "white" : "#dbdcdc",
            position: "relative",
            borderRadius: "100%",
            top: hasNextStop? "50%":"30px",
            bottom: hasNextStop? "50%":"",
            transform: hasNextStop?"translate(-100%)":"",
            zIndex: 2,
          }}>
        </div>
      </div>
    );
  };

  

  // const busStopNo = selectedTrip
  // ? selectedTrip.stop_times.map((stop) => ({
  //     stopNo: stop.stop_sequence,
  //   }))
  // : [];

  // const Bus = ({ coordinates, busCoordinates }) => {
  //   const isVisible =
  //     busCoordinates !== null &&
  //     busCoordinates.latitude === coordinates.latitude &&
  //     busCoordinates.longitude === coordinates.longitude;
  //   return isVisible ? (
  //     <div
  //       className="bus"
  //       // style={{
  //       //   //        left: ${coordinates.longitude * 20}px, // Adjust as needed for visualization
  //       //   //        top: ${coordinates.latitude * 20}px, // Adjust as needed for visualization
  //       //   width: "10px", // Set your desired width
  //       //   height: "10px", // Set your desired height
  //       //   backgroundColor: "red", // Set your desired dot color
  //       //   borderRadius: "100%",
  //       // }}
  //     />
  //   ) : null;
  // };

  return (
    <div className="stop-list w-96">
      {selectedTrip &&
        selectedTrip.stop_times.map((stop, index) => {
          const hasNextStop = index < selectedTrip.stop_times.length - 1;
          const isLastStop = index === selectedTrip.stop_times.length;
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
                  coordinates={[stopCoordinates[index], stopNo]}
                  isLastStop={isLastStop}
                  hasNextStop={hasNextStop}
                  className="stop-dot"
                />
                {/* <Bus
                  coordinates={stopCoordinates[index]}
                  busCoordinates={busCoordinates}
                /> */}
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
            </div>
          );
        })}
    </div>
  );
};

export default SingleStationInfo;
