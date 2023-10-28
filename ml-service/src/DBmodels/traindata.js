import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const trainDataSchema = new Schema({
    route: { type: Schema.Types.ObjectId, ref: 'Route' },
    stop_times: [{
            timestamp: Date,
            trips: [{
                location: {
                                latitude: Number,
                                longitude: Number
                },
                speed: {
                    previousStop: { type: mongoose.Schema.Types.ObjectId, ref: 'StopTime' },
                    currentStop: { type: mongoose.Schema.Types.ObjectId, ref: 'StopTime' },
                    averageSpeed: Number
                }
            }]
    }]
})

const TrainData = mongoose.model('TrainData', trainDataSchema);

export { TrainData };