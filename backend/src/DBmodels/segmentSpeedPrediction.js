import mongoose, {Schema} from "mongoose";

const segmentSpeedPredictionSchema = new mongoose.Schema({
    trip_id: String,
    previous_stop_id: String,
    next_stop_id: String,
    segment_number: Number,
    average_speed: Number,
    speed_30_min_prediction: {speed: Number, level: Number},
    speed_60_min_prediction: {speed: Number, level: Number},
    shapes: [{ type: Schema.Types.ObjectId, ref: 'Shape' }]
})

const SegmentSpeedPrediction = mongoose.model("SegmentSpeedPrediction", segmentSpeedPredictionSchema);

export {SegmentSpeedPrediction};