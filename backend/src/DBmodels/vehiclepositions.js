import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const vehiclePositionsSchema = new Schema({
    city: String,
    currentTrip_id: { type: Schema.Types.ObjectId, ref: 'Trip' },
    route: { type: Schema.Types.ObjectId, ref: 'Route' },
    timestamp: String,
    current_position: {
            latitude: Number,
            longitude: Number
    },
    previous_position: {
        latitude: Number,
        longitude: Number
    },
    stop_id: String,
    current_stop_sequence: Number,
    current_status: String,
    congestion_level: {
        timestamp: Date,
        level: Number,
        previousStop: { type: Schema.Types.ObjectId, ref: 'StopTime'},
        currentStop: { type: Schema.Types.ObjectId, ref: 'StopTime' },

    }

})

const VehiclePositions = mongoose.model('VehiclePositions', vehiclePositionsSchema);

export { VehiclePositions };