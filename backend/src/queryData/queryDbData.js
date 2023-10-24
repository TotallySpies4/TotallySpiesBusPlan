import {Route, Speed, StopTime} from "../DBmodels/busline.js";
import mongoose from "mongoose";
import {segmentAvgSpeedCalculator} from "../utils/speedCalculator.js";

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

        const route = await Route.findOne({ route_id: routeID }).populate('trips');
        if (!route) {
            throw new Error('No matching route found in database.');
        }
        console.log("route",route._id)
        console.log("trip",tripID)

        // Locate the specific trip from the route's trips
        const trip = route.trips.find(t => t.trip_id === tripID);
        if (!trip) {
            throw new Error('No matching trip found for the provided route.');
        }

        // Fetch the stop times for the trip
        console.log("Stop sequence der uebergeben wurde",stopSequence)
        const currentStopTime = await StopTime.findOne({ _id: { $in: trip.stop_times }, stop_sequence: stopSequence });
        console.log("currentStopTime",currentStopTime)
        console.log("Stoptim ID",currentStopTime._id)
        if (!currentStopTime) {
            throw new Error('Stop time data not found for the given sequence.');
        }

        let previousStopTime, nextStopTime;
        if(stopSequence === 1){
            previousStopTime = null;
            nextStopTime = await StopTime.findOne({ _id: { $in: trip.stop_times }, stop_sequence: stopSequence + 1 });
        }
        else if (stopSequence > 1 && stopSequence <= trip.stop_times.length) {
            previousStopTime = await StopTime.findOne({ _id: { $in: trip.stop_times }, stop_sequence: stopSequence - 1 });
            nextStopTime = null;
        }


        // Assuming the max sequence is the length of trip.stop_times (you might need a different condition depending on your data model)
        console.log("trip.stop_times.length",trip.stop_times.length)

        // Fetch the speed entry
        let speedEntry;
        if (previousStopTime) {
            speedEntry = await segmentAvgSpeedCalculator(previousStopTime, currentStopTime);
            console.log("speedEntry",speedEntry)
            return { speedEntry, currentStopTime, previousStopTime};
        } else if (nextStopTime) {
            console.log("We are in the if nextStopTime")
            console.log("speedEntry",speedEntry)
            speedEntry = await segmentAvgSpeedCalculator(currentStopTime, nextStopTime);
            return { speedEntry, currentStopTime, nextStopTime };
        }




    } catch (error) {
        console.error("Error fetching average speed from database:", error);
        throw error;
    }
}



export {getBusAllBusline, getBusDetails , fetchAverageSpeedFromDB};