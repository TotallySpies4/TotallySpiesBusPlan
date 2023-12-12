import React from "react";
import { formatTime } from "../utils/formatTime.js";
export const SingleStationInfo = ({selectedTrip, tripUpdate,setSelectedCity}) => {
  const cityToTimeZone = {
    "Amsterdam": "Europe/Amsterdam",
    "Stockholm": "Europe/Stockholm",
  };
  const formatTime = (timestamp) => {
    const tz = cityToTimeZone[cityName] || 'UTC';
    return moment(timestamp * 1000).tz(tz).format('HH:mm');
  };

  // Diese Funktion formatiert die Verspätung als String
  const formatDelay = (delay) => {
    if (delay > 0) {
      const delayMinutes = Math.floor(delay / 60);
      return `Delay ${delayMinutes} min`;
    }
    return 'On time';
  };

  return (
      <div className="stop-list w-96">
        {selectedTrip && selectedTrip.stop_times.map((stop, index) => {
          console.log("TripUpdate",tripUpdate)
          console.log(tripUpdate[0].stopSequence)

          const stopUpdate = tripUpdate ? tripUpdate.find(update => update.stopSequence === stop.stop_sequence) : null;
          console.log("Update",stopUpdate);
          const isDelayed = stopUpdate && stopUpdate.arrival.delay > 0;
          console.log("isDelayed",isDelayed);
          const scheduledTimeStr = stop.arrival_time;
          const actualTimeStr = isDelayed ? formatTime(stopUpdate.arrival.time) : '';
          const delayStr = isDelayed ? formatDelay(stopUpdate.arrival.delay) : '';

          return (
              <div key={index} className="stop-item">
                <div className="stop-name">{stop.stop_name}</div>
                <div className="arrival-info">
                  <div className={`scheduled-time ${isDelayed ? "strike-through" : ""}`}>
                    {scheduledTimeStr}
                  </div>
                  {isDelayed && (
                      <>
                        <div className="delay-info">{delayStr}</div>
                        <div className="actual-time">{actualTimeStr}</div>
                      </>
                  )}
                </div>
              </div>
          );
        })}
      </div>
  );
};

export default SingleStationInfo;
