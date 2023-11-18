import {Route, StopTime, Trip} from "../DBmodels/busline.js";
import {segmentAvgSpeedCalculator} from "../utils/speedCalculator.js";
import {VehiclePositions} from "../DBmodels/vehiclepositions.js";
import {getShapesBetweenStops} from "../utils/shapesUtilSet.js";

async function getBusAllBuslineAmsterdam(){
    return Route.find({agency_id:"GVB"});
}

async function getBusAllBuslineStockholm(){
    return Route.find({agency_id:"14010000000001001"});
}

async function getBusDetails(routeID){
    const route = await Route.findOne({route_id: routeID}).populate('trips');
    if (!route) {
        throw new Error('No matching route found in database.');
    }
    const routeObjID = route._id;
    const currentVehicle = await VehiclePositions.findOne({route: routeObjID});
    if (!currentVehicle) {
        const trip = await handleInactivity(route)
        return {currentVehicle: null, trip: trip, congestionShape: null};
    }

    const trip = await Trip.findOne({_id: currentVehicle.currentTrip_id}).populate('stop_times').populate('shapes');
   if (!trip) {
    throw new Error('No matching trip found in database.');
   }
    console.log("trip after getting the route_Id",trip)
    console.log("currentVehicle after getting the route_Id",currentVehicle)

    const shapes = trip.shapes
   const previousStopTime = currentVehicle.congestion_level.previousStop;
    const currentStopTime = currentVehicle.congestion_level.currentStop;

    const  congestionShape = await getShapesBetweenStops(shapes, previousStopTime, currentStopTime)
   return {currentVehicle:currentVehicle, trip: trip,  congestionShape:congestionShape};
}

async function handleInactivity(route) {
    return Trip.findOne({_id: route.trips[0]}).populate('stop_times').populate('shapes');
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
        //console.log("Stop sequence der uebergeben wurde",stopSequence)
        const currentStopTime = await StopTime.findOne({ _id: { $in: trip.stop_times }, stop_sequence: stopSequence });
        //console.log("currentStopTime",currentStopTime)
        //console.log("Stoptim ID",currentStopTime._id)
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
        //console.log("trip.stop_times.length",trip.stop_times.length)

        // Fetch the speed entry
        let speedEntry;
        if (previousStopTime) {
            speedEntry = await segmentAvgSpeedCalculator(previousStopTime, currentStopTime);
            //console.log("speedEntry",speedEntry)
            const currentStop = currentStopTime
            const previousStop = previousStopTime
            return { speedEntry, currentStop, previousStop};
        } else if (nextStopTime) {
            //console.log("We are in the if nextStopTime")
            //console.log("speedEntry",speedEntry)
            const previousStop = currentStopTime
            const currentStop = nextStopTime
            speedEntry = await segmentAvgSpeedCalculator(currentStopTime, nextStopTime);
            return { speedEntry, currentStop, previousStop}
        }




    } catch (error) {
        console.error("Error fetching average speed from database:", error);
        throw error;
    }
}



export {getBusAllBuslineAmsterdam,getBusAllBuslineStockholm, getBusDetails , fetchAverageSpeedFromDB};