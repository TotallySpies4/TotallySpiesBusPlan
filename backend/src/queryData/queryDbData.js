import {Route, StopTime, Trip} from "../DBmodels/busline.js";
import {calculatorScheduledSpeedAmsterdam} from "../utils/speedCalculator.js";
import {VehiclePositions} from "../DBmodels/vehiclepositions.js";
import {getShapesBetweenStops} from "../utils/shapesUtilSet.js";
import {agency} from "../utils/enum.js";
import {TripUpdate} from "../DBmodels/tripUpdate.js";
import {SegmentSpeedPrediction} from "../DBmodels/segmentSpeedPrediction.js";

/**
 * Method to get all bus lines from Amsterdam
 * @returns {Promise<*>}
 */
export async function getBusAllBuslineAmsterdam(){
    return Route.find({agency_id:agency.GVB});
}

/**
 * Method to get all bus lines from Stockholm
 * @returns {Promise<*>}
 */
export async function getBusAllBuslineStockholm(){
    return Route.find({agency_id:agency.SL});
}


export async function getBusDetails(routeID){
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

    //Congestion Shape current stop and previous stop
    const shapes = trip.shapes
    const previousStopTime = currentVehicle.congestion_level.previousStop;
    const currentStopTime = currentVehicle.congestion_level.currentStop;
    const congestionShape = await getShapesBetweenStops(shapes, previousStopTime, currentStopTime)

    //Trip Update
    const tripUpdate = await TripUpdate.findOne({trip_id: trip.trip_id});
    const updateStoptime = tripUpdate ? tripUpdate.stopTimeUpdates : null;

    //Prediction
    const segmentSpeedPrediction = await SegmentSpeedPrediction.find({trip_id: trip.trip_id}).sort('segment_number').populate('shapes');


   return {currentVehicle:currentVehicle, trip: trip,  congestionShape:congestionShape, updateStoptime: formatTimeAndDelayOf(updateStoptime), segmentSpeedPrediction: segmentSpeedPrediction};
}



function formatTimeAndDelayOf(stopTimeUpdates) {
    if(stopTimeUpdates && stopTimeUpdates.length > 0){
        stopTimeUpdates.forEach(stopTimeUpdate => {
            stopTimeUpdate.arrival.delay = formatDelay(stopTimeUpdate.arrival.delay);
            stopTimeUpdate.departure.delay = formatDelay(stopTimeUpdate.departure.delay);

            stopTimeUpdate.arrival.time = convertUnixTimeToReadable(stopTimeUpdate.arrival.time);
            stopTimeUpdate.departure.time = convertUnixTimeToReadable(stopTimeUpdate.departure.time);
        });
    }
    return stopTimeUpdates;
}

/**
 * Helper Method to handle inactivity
 * @param route
 * @returns {Promise<*>}
 */
async function handleInactivity(route) {
    return Trip.findOne({_id: route.trips[0]}).populate('stop_times').populate('shapes');
}


/**
 * Method to fetch the average speed
 * @param routeID
 * @param tripID
 * @param stopSequence
 * @returns {Promise<{speedEntry: *, currentStop: *, previousStop: *}>}
 */

export async function fetchAverageSpeed(routeID, tripID, stopSequence) {
    try {
        // Fetch the relevant route
        const route = await Route.findOne({ route_id: routeID }).populate('trips');
        if (!route) {
            throw new Error('No matching route found in database.');
        }
        // Locate the specific trip from the route's trips
        const trip = route.trips.find(t => t.trip_id === tripID);
        if (!trip) {
            throw new Error('No matching trip found for the provided route.');
        }
        // Fetch the stop times for the trip
        const currentStopTime = await StopTime.findOne({ _id: { $in: trip.stop_times }, stop_sequence: stopSequence });
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
        // Fetch the speed entry
        let speedEntry;
        if (previousStopTime) {
            speedEntry = await calculatorScheduledSpeedAmsterdam(previousStopTime, currentStopTime);
            //console.log("speedEntry",speedEntry)
            const currentStop = currentStopTime
            const previousStop = previousStopTime
            return { speedEntry, currentStop, previousStop};
        } else if (nextStopTime) {
            const previousStop = currentStopTime
            const currentStop = nextStopTime
            speedEntry = await calculatorScheduledSpeedAmsterdam(currentStopTime, nextStopTime);
            return { speedEntry, currentStop, previousStop}
        }
    } catch (error) {
        console.error("Error fetching average speed from database:", error);
        throw error;
    }
}
