import {VehiclePositions} from "../DBmodels/vehiclepositions.js";
import {congestionLevelStockholm} from "../utils/congestionLevel.js";

class StockholmVehicleDataProcessor extends IVehicleDataProcessor {
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
    updateVehicle(vehicle,existingTrip, existingPosition) {
        existingPosition.timestamp = vehicle.vehicle.timestamp || new Date();
        existingPosition.current_position.latitude = vehicle.vehicle.position.latitude;
        existingPosition.current_position.longitude = vehicle.vehicle.position.longitude;
        existingPosition.congestion_level.timestamp = new Date();

        const congestionLevelObject = congestionLevelStockholm(existingTrip.trip_id, vehicle.vehicle.position.speed, vehicle.vehicle.position.latitude, vehicle.vehicle.position.longitude);
        existingPosition.congestion_level.level = congestionLevelObject.congestionLevel;
        existingPosition.congestion_level.currentStop = congestionLevelObject.nextStop;
        existingPosition.congestion_level.previousStop = congestionLevelObject.currentStop;
    }

}
