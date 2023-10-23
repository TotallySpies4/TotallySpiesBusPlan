import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const vehiclePositionsSchema = new Schema({
    trip_id: String,
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
})

const VehiclePositions = mongoose.model('VehiclePositions', vehiclePositionsSchema);

export { VehiclePositions };