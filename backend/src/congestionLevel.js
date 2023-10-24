import { realtimeAvgSpeedCalculator } from "./utils/speedCalculator.js";
import { fetchAverageSpeedFromDB } from "./queryData/queryDbData.js";

/**
 * Method to calculate the congestion level of a route segment
 * @param routeID
 * @param vehiclePosition array of vehiclePositions from the realtime API
 * @returns {Promise<number>}
 */
export async function congestionLevel(routeID, vehiclePosition) {


    // Fetch scheduled average speed for the current segment
    const speedObject = await fetchAverageSpeedFromDB(routeID, vehiclePosition.trip_id, vehiclePosition.stop_sequence);
    const scheduleSpeed = speedObject.speedEntry;

    // Calculate real-time average speed
    const route_avg_speed = realtimeAvgSpeedCalculator(vehiclePosition);

    if (vehiclePosition.trip_id === scheduleSpeed.trip_id && vehiclePosition.stop_sequence === routeID.stop_sequence) {
        if (scheduleSpeed.averageSpeed < route_avg_speed) {
            if (scheduleSpeed.averageSpeed < route_avg_speed + 10) {
                return 1; // yellow
            } else {
                return 2; // red
            }
        } else {
            return 0; // green
        }
    }
}
