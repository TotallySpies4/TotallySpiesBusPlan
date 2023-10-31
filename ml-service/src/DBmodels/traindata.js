import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import {Route, Trip, Speed} from "../../../backend/src/DBmodels/busline.js";

const trainDataSchema = new Schema({
    route: { type: Schema.Types.ObjectId, ref: 'Route' },
    stop_times: [{
            timestamp: Date,
            trips: [{
                trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
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