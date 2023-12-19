/**
 * Method to calculate the bearing between two stops
 * @param currentStop
 * @param nextStop
 * @returns {number}
 */

export function calculateBearing(currentStop, nextStop) {
    const toRadians = degree => degree * Math.PI / 180;
    const toDegrees = radian => radian * 180 / Math.PI;

    const startLat = currentStop.location.latitude;
    const startLng = currentStop.location.longitude;
    const destLat = nextStop.location.latitude;
    const destLng = nextStop.location.longitude;

    const startLatRad = toRadians(startLat);
    const startLngRad = toRadians(startLng);
    const destLatRad = toRadians(destLat);
    const destLngRad = toRadians(destLng);

    const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
    const x = Math.cos(startLatRad) * Math.sin(destLatRad) -
        Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);

    return (toDegrees(Math.atan2(y, x)) + 360) % 360; // Normalize the angle into the range 0° to 360°
}


/**
 * Method to check if the vehicle is moving towards the next nearest stop
 * @param nextStopBearing
 * @param vehicleBearing
 * @param tolerance
 * @returns {boolean}
 */
export function isMovingTowards(nextStopBearing, vehicleBearing, tolerance = 10) {
    // Check if the vehicle's bearing is within a certain range (tolerance) of the next stop's bearing
    const diff = Math.abs(vehicleBearing - nextStopBearing);
    return diff <= tolerance || diff >= 360 - tolerance;
}


/**
 * Method to calculate the distance between two points on a sphere
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns {number}
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const d1 = lat1 * Math.PI / 180;
    const d2 = lat2 * Math.PI / 180;
    const fd = (lat2 - lat1) * Math.PI / 180;
    const fDelta = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(fd / 2) * Math.sin(fd / 2) +
        Math.cos(d1) * Math.cos(d2) *
        Math.sin(fDelta / 2) * Math.sin(fDelta / 2);
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

/**
 * Method to calculate the time difference between two timestamps
 * @param startTime
 * @param endTime
 * @returns {number}
 */
export function timeDifferenceInSeconds(startTime, endTime) {
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    return (end - start) / 1000; // Convert milliseconds to seconds
}


