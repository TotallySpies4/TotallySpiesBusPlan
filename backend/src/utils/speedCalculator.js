import {StopTime} from "../DBmodels/busline.js";
import {
    calculateBearing,
    calculateDistance,
    calculateTimeDifference,
    haversineDistance, isMovingTowards,
    timeDifferenceInSeconds
} from "./calculateUtil.js";

/**
 * Method to calculate the average speed of a route
 * @param previousStop
 * @param currentStop
 * @returns {Promise<number|null>}
 */
 export async function calculatorScheduledSpeedAmsterdam(previousStop, currentStop ) {
  try {

      const distance = calculateDistance(previousStop.location.longitude, previousStop.location.latitude, currentStop.location.longitude, currentStop.location.latitude);
      const timeDifference = calculateTimeDifference(previousStop, currentStop);

    return (distance / timeDifference) * 3600;

  } catch (error) {
    throw new Error("Error calculating speed:");
  }
}

/**
 * Method to calculate the average speed of the vehiclePositions
 * @param vehiclePositions array of vehiclePositions from the realtime API
 * @returns {Promise<number>}
 */
 export async function realtimeAvgSpeedCalculator(vehiclePositions) {
    try {

        const currentPosition = vehiclePositions[1].position;
        const previousPosition = vehiclePositions[0].position;
        //console.log("currentPosition timestamp",currentPosition.timestamp)
        //console.log("previousPosition timestamp",previousPosition.timestamp)

        const currentTimestamp = parseInt(vehiclePositions[1].timestamp, 10); // In Sekunden
        const previousTimestamp = parseInt(vehiclePositions[0].timestamp, 10); // In Sekunden

        //console.log("currentTimestamp",currentTimestamp)
        //console.log("previousTimestamp",previousTimestamp)

        const distance = calculateDistance(
            previousPosition.longitude,
            previousPosition.latitude,
            currentPosition.longitude,
            currentPosition.latitude);

        //console.log("distance",distance)

        const timeDifference = currentTimestamp - previousTimestamp; // In seconds
        //console.log("timeDifference",timeDifference)

        if (timeDifference === 0) {
            return 0;
        }

        return (distance / timeDifference) * 3600;

    } catch (error) {
        console.error("Error calculating speed:", error);
    }
}

/**
 * Method to calculate the scheduled speed of a route segment for Stockholm
 * @param tripId
 * @param latitude
 * @param longitude
 * @param vehicleBearing
 * @returns {Promise<{nextStop, scheduleSpeed: number, currentStop}>}
 */

export async function calculateScheduledSpeedStockholm(tripId, latitude, longitude, vehicleBearing){
    const stopTimes = await StopTime.find({ trip_id: tripId }).sort('stop_sequence');
    console.log("In calculateScheduledSpeedStockholm ")
    //console.log('Stoptimes', stopTimes)

    // Determine the nearest stop based on latitude and longitude
    let nearestStop = findNearestStop(stopTimes, latitude, longitude);
    console.log("nearest stop", nearestStop)
    const nearestIndex = stopTimes.indexOf(nearestStop);
    console.log("nearest index:", nearestIndex)

    // Determine the direction of travel
    let currentStop, nextStop;
    if (nearestIndex < stopTimes.length - 1) {
        const nextIndex = nearestIndex + 1;
        const nextStopBearing = calculateBearing(nearestStop, stopTimes[nextIndex]);
        console.log("nextIndex", nextIndex)
        console.log("nextStopbearing", nextStopBearing)
        console.log("isMovingTowards", isMovingTowards(nextStopBearing, vehicleBearing))

        if (isMovingTowards(nextStopBearing, vehicleBearing)) {
            console.log("1")
            currentStop = stopTimes[nextIndex];
            nextStop = nearestStop;
        } else {
            console.log("2")
            if(nearestIndex>0){
                currentStop = stopTimes[nearestIndex - 1];
                nextStop = nearestStop;
            } else if(nearestIndex===0){
                currentStop = nearestStop;
                nextStop = stopTimes[nearestIndex + 1];
            }
        }
    } else {
        // Handle last stop scenario
        currentStop = nearestIndex > 0 ? stopTimes[nearestIndex - 1] : null;
        nextStop = nearestStop;
    }

    if (!currentStop || !nextStop) {
        console.error('Current or next stop not found');
        return;
    }

    // Calculate distance and time difference
    const speedSchedule = calculateScheduledSpeed(currentStop, nextStop);
    return { scheduleSpeed: speedSchedule, currentStop: currentStop, nextStop: nextStop }

}

/**
 * Method to calculate the scheduled speed of a route segment
 * @param previousStop
 * @param currentStop
 * @returns {number}
 */
export function calculateScheduledSpeed(previousStop, currentStop) {
    try {
        const distance = calculateDistance(previousStop.location.latitude, previousStop.location.longitude, currentStop.location.latitude, currentStop.location.longitude);
        const timeDifferenceSeconds = timeDifferenceInSeconds(previousStop.departure_time, currentStop.arrival_time);
        const timeDifferenceHours = timeDifferenceSeconds / 3600;
        return distance / timeDifferenceHours
    } catch (error) {
        throw new Error("Error calculating speed:");
    }
}

/**
 * Method to find the nearest stop based on latitude and longitude
 * @param stopTimes
 * @param lat
 * @param lon
 * @returns {null}
 */
export function findNearestStop(stopTimes, lat, lon) {
    let nearestStop = null;
    let smallestDistance = Infinity;
    for (const stop of stopTimes) {
        const distance = haversineDistance(lat, lon, stop.location.latitude, stop.location.longitude);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            nearestStop = stop;
        }
    }
    return nearestStop;
}


