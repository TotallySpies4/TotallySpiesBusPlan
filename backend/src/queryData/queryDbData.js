import {Route, Speed, StopTime} from "../DBmodels/busline.js";
import mongoose from "mongoose";

async function getBusAllBusline(){
    return Route.find({});
}

async function getBusDetails(routeID){
    return Route.find({route_id: routeID})
        .populate('stop_times')
        .populate('routeCoordinates');
}

async function fetchAverageSpeedFromDB(routeID, tripID, stopSequence) {
    try {

        // Fetch the relevant route
        const route = await Route.findOne({ route_id: routeID, trip_id: tripID });
        if (!route) {
            throw new Error('No matching route found in database.');
        }

        // Fetch the stop times for the route
        const currentStopTime = await StopTime.findOne({ _id: { $in: route.stop_times }, stop_sequence: stopSequence });
        const previousStopTime = await StopTime.findOne({ _id: { $in: route.stop_times }, stop_sequence: stopSequence - 1 });

        if (!currentStopTime || !previousStopTime) {
            throw new Error('Stop time data not found for the given sequence.');
        }

        // Fetch the speed entry for the current and previous stop time
        const speedEntry = await Speed.findOne({
            route: route._id,
            trip: tripID,
            previousStop: previousStopTime._id,
            currentStop: currentStopTime._id
        });

        if (!speedEntry) {
            throw new Error('Speed data not found for the given stops.');
        }

        return {speedEntry, currentStopTime, previousStopTime};

    } catch (error) {
        console.error("Error fetching average speed from database:", error);
        throw error;
    }
}

export {getBusAllBusline, getBusDetails , fetchAverageSpeedFromDB};