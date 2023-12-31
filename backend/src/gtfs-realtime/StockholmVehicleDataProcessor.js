import {VehiclePositions} from "../DBmodels/vehiclepositions.js";
import {congestionLevelStockholm} from "../utils/congestionLevel.js";
import {IVehicleDataProcessor} from "./IVehicleDataProcessor.js";
import {TripUpdate} from "../DBmodels/tripUpdate.js";


export class StockholmVehicleDataProcessor extends IVehicleDataProcessor {
    createNewVehicle(vehicle,existingTrip,route,city) {
        return new VehiclePositions({
            city: city,
            currentTrip_id: existingTrip._id,
            route: route._id,
            timestamp: vehicle.vehicle.timestamp || new Date(),
            current_position: {
                latitude: vehicle.vehicle.position.latitude,
                longitude: vehicle.vehicle.position.longitude
            },
            congestion_level: {
                timestamp: new Date(),  // Using current timestamp as default
                level: 0, // Setting level as 0 by default
                previousStop: null,
                currentStop: null
            }
        })
    }
    async updateVehicle(vehicle, existingPosition, existingTrip) {
        console.log("update stockholm")
        console.log("Existingposition:", existingPosition)
        existingPosition.timestamp = vehicle.vehicle.timestamp || new Date();
        existingPosition.current_position.latitude = vehicle.vehicle.position.latitude;
        existingPosition.current_position.longitude = vehicle.vehicle.position.longitude;
        existingPosition.congestion_level.timestamp = new Date();

        console.log("existingtrip Id:", existingTrip.trip_id)
        console.log("existingTrip objID", existingTrip._id)
        const congestionLevelObject = await congestionLevelStockholm(
            existingTrip._id,
            vehicle.vehicle.position.speed,
            vehicle.vehicle.position.latitude,
            vehicle.vehicle.position.longitude,
            vehicle.vehicle.position.bearing);
        console.log("congestionLevelObject:", congestionLevelObject)
        existingPosition.congestion_level.level = congestionLevelObject.congestionLevel;
        existingPosition.congestion_level.currentStop = congestionLevelObject.nextStop;
        existingPosition.congestion_level.previousStop = congestionLevelObject.currentStop;
    }

    createNewTripUpdate(tripUpdate, city){
        console.log("create new trip update stockholm")
        return new TripUpdate({
            city: city,
            trip_id: tripUpdate.tripUpdate.trip.tripId,
            stopTimeUpdates: tripUpdate.tripUpdate.stopTimeUpdate
        })
        }


    updateTrip(existingTripUpdate, tripUpdate){
        existingTripUpdate.stopTimeUpdates = tripUpdate.tripUpdate.stopTimeUpdate
    }

}
