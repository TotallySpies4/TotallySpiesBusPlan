import mongoose from "mongoose";
const Schema = mongoose.Schema;

const stopTimeUpdateSchema = new Schema({
    stopSequence: Number,
    trip_id: String,
    arrival: {
        delay: Number,
        time: Number,
    },
    departure: {
        delay: Number,
        time: Number,
    },
    stop_id: String,

})

const tripUpdateSchema = new Schema({
    trip_id: String,
    stopTimeUpdates: [stopTimeUpdateSchema]
})

const TripUpdate = mongoose.model("TripUpdate", tripUpdateSchema);
export {TripUpdate};