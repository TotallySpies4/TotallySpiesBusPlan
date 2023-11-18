import {VehiclePositions} from "../DBmodels/vehiclepositions.js";
import {Route} from "../DBmodels/busline.js";
import {congestionLevel} from "../utils/congestionLevel.js";

class AmsterdamVehicleDataProcessor extends IVehicleDataProcessor {
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
            previous_position: {
                latitude: null,
                longitude: null
            },
            stop_id: vehicle.vehicle.stopId,
            current_stop_sequence: vehicle.vehicle.currentStopSequence,
            current_status: vehicle.vehicle.currentStatus,
            congestion_level: {
                timestamp: new Date(),  // Using current timestamp as default
                level: 0, // Setting level as 0 by default
                previousStop: null,
                currentStop: null
            }
        });
    }
    async updateVehicle(vehicle, existingPosition, existingTrip) {
        // Calculate congestion level
        const previousPosition = {
            position: existingPosition.current_position,
            timestamp: existingPosition.timestamp
        };
        const currentPosition = {position: vehicle.vehicle.position, timestamp: vehicle.vehicle.timestamp};


        const route = await Route.findOne({_id: existingTrip.route_id});
        if (existingPosition.current_position.latitude !== vehicle.vehicle.position.latitude || existingPosition.current_position.latitude !== vehicle.vehicle.position.longitude) {

            const vehicleInfo = {
                trip_id: existingTrip.trip_id,
                stopSequence: vehicle.vehicle.currentStopSequence,
                positions: [previousPosition, currentPosition]
            }

            const congestion = await congestionLevel(route.route_id, vehicleInfo);

            existingPosition.congestion_level.timestamp = new Date();
            existingPosition.congestion_level.level = congestion.congestionLevel;
            existingPosition.congestion_level.previousStop = congestion.previousStop;
            existingPosition.congestion_level.currentStop = congestion.currentStop;
        }
        existingPosition.previous_position.latitude = existingPosition.current_position.latitude;
        existingPosition.previous_position.longitude = existingPosition.current_position.longitude;
        existingPosition.current_position.latitude = vehicle.vehicle.position.latitude;
        existingPosition.current_position.longitude = vehicle.vehicle.position.longitude;
        existingPosition.timestamp = vehicle.vehicle.timestamp || new Date(); // Just making sure there's a fallback
        existingPosition.current_stop_sequence = vehicle.vehicle.currentStopSequence;
        existingPosition.current_status = vehicle.vehicle.current_status;
        existingPosition.stop_id = vehicle.vehicle.stopId;

    }
}
