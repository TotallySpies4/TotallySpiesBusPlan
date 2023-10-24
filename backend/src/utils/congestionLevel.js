import { realtimeAvgSpeedCalculator } from "./speedCalculator.js";
import { fetchAverageSpeedFromDB } from "../queryData/queryDbData.js";

/**
 * Method to calculate the congestion level of a route segment
 * @param routeID
 * @param vehiclePosition array of vehiclePositions from the realtime API
 * @returns {Promise<{congestionLevel: number, currentStop: (*|null), previousStop: (*|undefined|null)}>}
 */
export async function congestionLevel(routeID, vehiclePosition) {


    // Fetch scheduled average speed for the current segment
    const speedObject = await fetchAverageSpeedFromDB(routeID, vehiclePosition.trip_id, vehiclePosition.stopSequence);
    const scheduleSpeed = speedObject.speedEntry;
    const previousStop = speedObject.previousStop;
    const currentStop = speedObject.currentStop;
    console.log("scheduleSpeed",scheduleSpeed)

    // Calculate real-time average speed
    const route_avg_speed = await realtimeAvgSpeedCalculator(vehiclePosition.positions);



        if (scheduleSpeed <= route_avg_speed) {
            if (scheduleSpeed < route_avg_speed + 10) {
                return {congestionLevel: 1, previousStop: previousStop, currentStop: currentStop }; // yellow
            } else {
                return {congestionLevel: 2, previousStop: previousStop, currentStop: currentStop }; // red
            }
        } else {
            return {congestionLevel: 0, previousStop: previousStop, currentStop: currentStop }; // green
        }

}
