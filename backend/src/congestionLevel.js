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
    const speedObject = await fetchAverageSpeedFromDB(routeID, vehiclePosition.trip_id, vehiclePosition.stopSequence);
    const scheduleSpeed = speedObject.speedEntry;
    console.log("scheduleSpeed",scheduleSpeed)

    // Calculate real-time average speed
    const route_avg_speed = realtimeAvgSpeedCalculator(vehiclePosition.positions);
    console.log("route_avg_speed",route_avg_speed)


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
