import { calculateSpeedForRoute } from "./speedHelper";
import { calculateRouteAvgSpeed } from "./RouteAvgSpeed";
// import mongoose from "mongoose";

export async function congestionLevel(routeID, vehiclePosition){
    const scheduleSpeed = calculateSpeedForRoute(routeID);
    const route_avg_speed = calculateRouteAvgSpeed(vehiclePosition);
    if(vehiclePosition.tripID===routeID.tripI && vehiclePosition.stop_sequence===routeID.stop_sequence){
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