import { readFile } from 'fs/promises';
import { FeedMessage } from 'gtfs-realtime-bindings';
import mongoose from 'mongoose';
import { VehiclePositions } from "./DBmodels/vehiclepostions.js";
import { calculateDistance, calculateTimeDifference } from './distanceHelper.js';

export async function importGtfsRealtimeData() {
    try {
        const pbData = await readFile('./gtfs-realtime/vehiclePositions.pb');

        const feed = FeedMessage.decode(pbData)

    console.log('Connected to MongoDB');

    let previousPosition = null;

    for (const entity of feed.entity){
        const position = entity.vehicle.position;
        const timestamp = entity.vehicle.timestamp.toNumber();

        const speed = calculateSpeed(previousPosition, position, timestamp);

        const vehiclePosition = new VehiclePositions({
            trip: entity.vehicle.trip.trip_id,
            route: entity.vehicle.trip.route_id,
            timestamp,
            latitude: position ? position.latitude : 0,
            longitude: position ? position.longitude : 0,
            speed,
            current_stop_sequence: entity.vehicle.current_stop_sequence,
            current_status: entity.vehicle.current_status,
            stop_id: entity.vehicle.stop_id,
        });
        await vehiclePosition.save();

        // Update the previous position for the next iteration
        previousPosition = position;
    }
} catch (error) {
    console.error('Error importing GTFS-realtime data:', error);
} finally {
    await mongoose.disconnect();
    }
}

function calculateSpeed(tripId, position, timestamp) {

    if (previousPosition) {
            const timeDifference = (timestamp - previousPosition.timestamp) / 1000; // Convert to seconds
            const distance = calculateDistance(
                previousPosition.latitude,
                previousPosition.longitude,
                currentPosition.latitude,
                currentPosition.longitude
            );

            const speed = (distance / timeDifference) * 3600; // Convert to km/h
            return speed;
    }
    return 0;
}