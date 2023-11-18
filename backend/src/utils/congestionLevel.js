import {calculateScheduledSpeedStockholm, realtimeAvgSpeedCalculator} from "./speedCalculator.js";
import { fetchAverageSpeed } from "../queryData/queryDbData.js";

/**
 * Method to calculate the congestion level of a route segment
 * @param routeID
 * @param vehiclePosition array of vehiclePositions from the realtime API
 * @returns {Promise<{congestionLevel: number, currentStop: (*|null), previousStop: (*|undefined|null)}>}
 */
export async function congestionLevel(routeID, vehiclePosition) {


    // Fetch scheduled average speed for the current segment
    const speedObject = await fetchAverageSpeed(routeID, vehiclePosition.trip_id, vehiclePosition.stopSequence);
    const scheduleSpeed = speedObject.speedEntry;
    const previousStop = speedObject.previousStop;
    const currentStop = speedObject.currentStop;
    //console.log("scheduleSpeed",scheduleSpeed)

    // Calculate real-time average speed
    const route_avg_speed = await realtimeAvgSpeedCalculator(vehiclePosition.positions);


        // professor said that if the route_avg_speed is larger than scheduleSpeed just 1 or 2 km/h, set this value to congestion level 1 is not fair.
        // so we need an interval for it.
    return {congestionLevel: level(scheduleSpeed, route_avg_speed), previousStop: previousStop, currentStop: currentStop}


}

/**
 * Method to calculate the congestion level of a route segment for Stockholm
 * @param tripID
 * @param speed
 * @param latitude
 * @param longitude
 * @param vehicleBearing
 * @returns {{nextStop: *, congestionLevel: number, currentStop: *}}
 */
export async function congestionLevelStockholm(tripID, speed, latitude, longitude,vehicleBearing) {
    console.log("in congestionLevelStockholm")
// calculate scheduleSpeed
    const speedObject = await calculateScheduledSpeedStockholm(tripID, latitude, longitude, vehicleBearing);
    return {
        congestionLevel: level(speedObject.scheduleSpeed, speed),
        currentStop: speedObject.currentStop,
        nextStop: speedObject.nextStop
    }
}

/**
 * Method to calculate the congestion level
 * @param scheduleSpeed
 * @param route_avg_speed
 * @returns {number}
 */
function level(scheduleSpeed, route_avg_speed){
    if (scheduleSpeed <= route_avg_speed + 5) {
        if (scheduleSpeed < route_avg_speed + 20) {
            return 1; // yellow
        } else {
            return 2; // red
        }
    } else {
        return 0; // green
    }
}
