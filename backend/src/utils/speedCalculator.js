import {StopTime} from "../DBmodels/busline.js";

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
 * @param vehiclePositions array of vehiclePositions from the realtime API
 * @returns {Promise<number>}
 */
 export async function realtimeAvgSpeedCalculator(vehiclePositions) {
    try {

        const currentPosition = vehiclePositions[1].position;
        const previousPosition = vehiclePositions[0].position;
        console.log("currentPosition timestamp",currentPosition.timestamp)
        console.log("previousPosition timestamp",previousPosition.timestamp)

        const currentTimestamp = parseInt(vehiclePositions[1].timestamp, 10); // In Sekunden
        const previousTimestamp = parseInt(vehiclePositions[0].timestamp, 10); // In Sekunden


        console.log("currentTimestamp",currentTimestamp)
        console.log("previousTimestamp",previousTimestamp)


        const distance = calculateDistance(
            previousPosition.longitude,
            previousPosition.latitude,
            currentPosition.longitude,
            currentPosition.latitude);

        console.log("distance",distance)

        const timeDifference = currentTimestamp - previousTimestamp; // In seconds
        console.log("timeDifference",timeDifference)

        if (timeDifference === 0) {
            throw new Error("Time difference is zero, cannot calculate speed.");
        }


        const speed = (distance / timeDifference) * 3600; // km/h
        console.log("speed",speed)

        return speed;

    } catch (error) {
        console.error("Error calculating speed:", error);
    }
}

export async function calculateScheduledSpeedStockholm(tripId, latitude, longitude,vehicleBearing){
    const stopTimes = await StopTime.find({ trip_id: tripId }).sort('stop_sequence');

    // Determine the nearest stop based on latitude and longitude
    let nearestStop = findNearestStop(stopTimes, latitude, longitude);
    const nearestIndex = stopTimes.indexOf(nearestStop);

    // Determine the direction of travel
    let currentStop, nextStop;
    if (nearestIndex < stopTimes.length - 1) {
        const nextIndex = nearestIndex + 1;
        const nextStopBearing = calculateBearing(nearestStop, stopTimes[nextIndex]);

        if (isMovingTowards(nextStopBearing, vehicleBearing)) {
            currentStop = nearestStop;
            nextStop = stopTimes[nextIndex];
        } else {
            currentStop = nearestIndex > 0 ? stopTimes[nearestIndex - 1] : null;
            nextStop = nearestStop;
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
    const distance = nextStop.shape_dist_traveled - currentStop.shape_dist_traveled;
    const timeDifferenceSeconds = timeDifferenceInSeconds(currentStop.departure_time, nextStop.arrival_time);
    const timeDifferenceHours = timeDifferenceSeconds / 3600;
    const speedSchedule = distance / timeDifferenceHours;
    return { scheduleSpeed: speedSchedule, currentStop: currentStop, nextStop: nextStop }

}

function calculateBearing(currentStop, nextStop) {
    const toRadians = degree => degree * Math.PI / 180;
    const toDegrees = radian => radian * 180 / Math.PI;

    const startLat = currentStop.latitude;
    const startLng = currentStop.longitude;
    const destLat = nextStop.latitude;
    const destLng = nextStop.longitude;

    const startLatRad = toRadians(startLat);
    const startLngRad = toRadians(startLng);
    const destLatRad = toRadians(destLat);
    const destLngRad = toRadians(destLng);

    const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
    const x = Math.cos(startLatRad) * Math.sin(destLatRad) -
        Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);

    return (toDegrees(Math.atan2(y, x)) + 360) % 360; // Normalize the angle into the range 0° to 360°
}

function isMovingTowards(nextStopBearing, vehicleBearing, tolerance = 10) {
    // Check if the vehicle's bearing is within a certain range (tolerance) of the next stop's bearing
    const diff = Math.abs(vehicleBearing - nextStopBearing);
    return diff <= tolerance || diff >= 360 - tolerance;
}


function findNearestStop(stopTimes, lat, lon) {
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

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
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


    const departureTime1 = parseTime(stop1.departure_time);
    const arrivalTime2 = parseTime(stop2.arrival_time);

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
 * @returns {Date} Date object
 */
 export function parseTime(timeString) {
    if (!timeString) {
        console.error("parseTime called with undefined or empty timeString:", timeString);
        return new Date();
    }

    const [hours, minutes, seconds] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
}
function timeDifferenceInSeconds(startTime, endTime) {
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    return (end - start) / 1000; // Convert milliseconds to seconds
}



