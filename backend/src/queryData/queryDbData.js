import {Route, StopTime, Trip} from "../DBmodels/busline.js";
import {calculatorScheduledSpeedAmsterdam} from "../utils/speedCalculator.js";
import {VehiclePositions} from "../DBmodels/vehiclepositions.js";
import {getShapesBetweenStops} from "../utils/shapesUtilSet.js";
import {agency} from "../utils/enum.js";
import {TripUpdate} from "../DBmodels/tripUpdate.js";
import {SegmentSpeedPrediction} from "../DBmodels/segmentSpeedPrediction.js";
import {handleInactivity} from "../utils/querydataUtil.js";

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


   return {currentVehicle:currentVehicle, trip: trip,  congestionShape: congestionShape, updateStoptime: updateStoptime, segmentSpeedPrediction: segmentSpeedPrediction};
}

