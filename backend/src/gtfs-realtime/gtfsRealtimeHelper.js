import { readFile } from 'fs/promises';
import { FeedMessage } from 'gtfs-realtime-bindings';
import mongoose from 'mongoose';
import { VehiclePositions } from "./DBmodels/vehiclepostions.js";

export async function importGtfsRealtimeData() {
    try {
        const pbData = await readFile('./gtfs-realtime/vehiclePositions.pb');

        const feed = FeedMessage.decode(pbData);

        await mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan',
        serverSelectionTimeoutMS: 60000),
    });
    console.log('Connected to MongoDB');

    for (const entity of feed.entity){
        const vehiclePosition = new VehiclePositions({
            trip: entity.vehicle.trip.trip_id,
            route: entity.vehicle.trip.route_id,
            timestamp: entity.vehicle.timestamp,
            latitude: entity.vehicle.position.latitude,
            longitude: entity.vehicle.position.longitude,
            speed:        ,
            current_stop_sequence: entity.vehicle.current_stop_sequence,
            current_status: entity.vehicle.current_status,
            stop_id: entity.vehicle.stop_id,
        });
        await vehiclePosition.save();
    }
} catch (error) {
    console.error('Error importing GTFS-realtime data:', error);
} finally {
    await mongoose.disconnect();
    }
}