import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const vehiclePositionsSchema = new Schema({
    currentTrip_id: { type: Schema.Types.ObjectId, ref: 'Trip' },
    route: { type: Schema.Types.ObjectId, ref: 'Route' },
    timestamp: Date,
    position: {
            latitude: Number,
            longitude: Number
    },
    speed: Number,
    current_stop_sequence: Number,
    current_status: Number,
    stop_id: String,
    congestion_level: Number
})

const VehiclePositions = mongoose.model('VehiclePositions', vehiclePositionsSchema);

export { VehiclePositions };