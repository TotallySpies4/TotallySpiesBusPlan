import {realtimeAvgSpeedCalculator, segmentAvgSpeedCalculator} from "./utils/speedCalculator.js";


/**
 * Method to calculate the congestion level of a route
 * @param routeID
 * @param vehiclePosition
 * @returns {Promise<number>}
 */

export async function congestionLevel(routeID, vehiclePosition){
    const scheduleSpeed = segmentAvgSpeedCalculator(routeID);
    const route_avg_speed = realtimeAvgSpeedCalculator(vehiclePosition);

    const route = (await scheduleSpeed).route[0]
    if(vehiclePosition.trip_id===route.trip_id && vehiclePosition.stop_sequence===routeID.stop_sequence){
        if(scheduleSpeed<route_avg_speed){
            if(scheduleSpeed<route_avg_speed+10){
                return 1; // yellow
            }else{
                return 2; // red
            }
        }else{
            return 0; // green
        }
    }
}