import {calculateDistance, calculateTimeDifference} from "./distanceHelper.js";

/**
 * Method to calculate the average speed of a route
 * @param previousStop
 * @param currentStop
 * @returns {Promise<number|null>}
 */
export async function segmentAvgSpeedCalculator(previousStop, currentStop ) {
  try {

      const distance = calculateDistance(previousStop.location.longitude, previousStop.location.latitude, currentStop.location.longitude, currentStop.location.latitude);
      const timeDifference = calculateTimeDifference(previousStop, currentStop);

    return (distance / timeDifference) * 3600;

  } catch (error) {
    console.error("Error calculating speed:", error);
    return null;
  }
}

/**
 * Method to calculate the average speed of the vehiclePositions
 * @param vehiclePositions
 * @returns {Promise<number>}
 */
export async function realtimeAvgSpeedCalculator(vehiclePositions) {
    try {
        // Check if vehiclePositions is an array with at least two entries
        if (!vehiclePositions || vehiclePositions.length < 2) {
            throw new Error('Insufficient data to calculate average speed.');
        }

        // Check if all vehiclePositions have the same routeId and tripId
        const routeId = vehiclePositions[0].vehicle.trip.routeId;
        const tripId = vehiclePositions[0].vehicle.trip.tripId;

        for (const position of vehiclePositions) {
            if (position.vehicle.trip.routeId !== routeId || position.vehicle.trip.tripId !== tripId) {
                throw new Error('Inconsistent routeId or tripId in vehiclePositions.');
            }
        }

        //sort vehiclePositions by timestamp
        vehiclePositions.sort((a, b) => a.vehicle.timestamp - b.vehicle.timestamp);

        // Calculate the average speed of the vehiclePositions
        let speedSum = 0;
        let speedCount = 0;

        for (let i = 1; i < vehiclePositions.length; i++) {
            const currentPosition = vehiclePositions[i].vehicle.position;
            const previousPosition = vehiclePositions[i - 1].vehicle.position;

            const distance = calculateDistance(
                previousPosition.longitude,
                previousPosition.latitude,
                currentPosition.longitude,
                currentPosition.latitude
            );

            const timeDifference = (vehiclePositions[i].vehicle.timestamp - vehiclePositions[i - 1].vehicle.timestamp) / 1000;

            if (timeDifference !== 0) {
                const speed = (distance / timeDifference) * 3600;
                speedSum += speed;
                speedCount++;
            }
        }

        if (speedCount > 0) {
            const averageSpeed = speedSum / speedCount;
            return averageSpeed;
        } else {
            throw new Error('Insufficient data to calculate average speed.');
        }
    } catch (error) {
        console.error("Error calculating speed:", error);
    }
}

/**
 * Method to calculate the distance between two points on
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns {number} distance in kilometers
 */

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
    return R * c;
}


/**
 * Method to calculate the time difference between two stops
 * @param stop1
 * @param stop2
 * @returns {number} time difference in seconds
 */

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


/**
 * Method to parse a time string into a Date object
 * @param timeString
 * @param format
 * @returns {Date} Date object
 */
export function parseTime(timeString, format) {
    const [hours, minutes, seconds] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
}


