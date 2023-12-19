import {calculateScheduledSpeedStockholm, realtimeAvgSpeedCalculator} from "./speedCalculator.js";
import {fetchAverageSpeed} from "../queryData/fetchAverageSpeed.js";
import {level} from "./level.js";

/**
 * Method to calculate the congestion level of a route segment
 * @param routeID
 * @param vehiclePosition array of vehiclePositions from the realtime API
 * @returns {Promise<{congestionLevel: number, currentStop: (*|null), previousStop: (*|undefined|null)}>}
 */
export async function congestionLevel(routeID, vehiclePosition) {
    const speedObject = await fetchAverageSpeed(routeID, vehiclePosition.trip_id, vehiclePosition.stopSequence);
    const scheduleSpeed = speedObject.speedEntry;
    const previousStop = speedObject.previousStop;
    const currentStop = speedObject.currentStop;
    const route_avg_speed = await realtimeAvgSpeedCalculator(vehiclePosition.positions);
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
    const speedObject = await calculateScheduledSpeedStockholm(tripID, latitude, longitude, vehicleBearing);
    return {
        congestionLevel: level(speedObject.scheduleSpeed, speed),
        currentStop: speedObject.currentStop,
        nextStop: speedObject.nextStop
    }
}