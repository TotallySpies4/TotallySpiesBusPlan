/**
 * Method to fetch the average speed
 * @param routeID
 * @param tripID
 * @param stopSequence
 * @returns {Promise<{speedEntry: *, currentStop: *, previousStop: *}>}
 */
import {calculatorScheduledSpeedAmsterdam} from "../utils/speedCalculator.js";
import {Route, StopTime} from "../DBmodels/busline.js";


export async function fetchAverageSpeed(routeID, tripID, stopSequence) {

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

}
