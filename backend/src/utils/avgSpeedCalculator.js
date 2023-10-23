import {calculateDistance, calculateTimeDifference} from "./distanceHelper.js";

/**
 * Method to calculate the average speed of a route
 * @param previousStop
 * @param currentStop
 * @returns {Promise<number|null>}
 */
export async function calculateSpeedForRoute(previousStop, currentStop ) {
  try {

      const distance = calculateDistance(previousStop.location.longitude, previousStop.location.latitude, currentStop.location.longitude, currentStop.location.latitude);
      const timeDifference = calculateTimeDifference(previousStop, currentStop);

    return (distance / timeDifference) * 3600;



  } catch (error) {
    console.error("Error calculating speed:", error);
    return null;
  }
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}


export function calculateTimeDifference(stop1, stop2) {
    const timeFormat = "HH:mm:ss"; // Specify the time format used in the stop times

    const departureTime1 = parseTime(stop1.departure_time, timeFormat);
    const arrivalTime2 = parseTime(stop2.arrival_time, timeFormat);

    // Calculate the time difference in seconds
    let timeDifference = (arrivalTime2 - departureTime1) / (1000);
    if(timeDifference===0){
        timeDifference=30;
    }
    return timeDifference;
}

// Helper function to parse a time string into a Date object
export function parseTime(timeString, format) {
    const [hours, minutes, seconds] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
}


