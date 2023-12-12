import React from "react";
import { formatTime } from "../utils/formatTime.js";
export const SingleStationInfo = ({selectedTrip, tripUpdate}) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      <div className="stop-list">
        {selectedTrip && selectedTrip.stop_times.map((stop, index) => {
          // Findet das zugehörige StopTimeUpdate-Objekt
          const stopUpdate = tripUpdate ? tripUpdate.find(update => update.stopSequence === stop.stopSequence) : null;
          const isDelayed = stopUpdate && stopUpdate.arrival.delay > 0;
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
