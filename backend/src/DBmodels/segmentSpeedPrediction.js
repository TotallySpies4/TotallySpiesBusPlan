import mongoose from "mongoose";

const segmentSpeedPredictionSchema = new mongoose.Schema({
    trip_id: String,
    previous_stop_id: String,
    next_stop_id: String,
    segment_number: Number,
    speed_30_min_prediction: Number,
    speed_60_min_prediction: Number
})

const SegmentSpeedPrediction = mongoose.model("SegmentSpeedPrediction", segmentSpeedPredictionSchema);