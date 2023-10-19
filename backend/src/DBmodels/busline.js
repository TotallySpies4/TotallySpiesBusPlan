import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const stopTimeSchema = new Schema({
    stop_id: String,
    stop_sequence: Number,
    arrival_time: String,
    departure_time: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    stop_name: String,
    route: { type: Schema.Types.ObjectId, ref: 'Route' }
});

const shapeSchema = new Schema({
    shape_pt_lat: Number,
    shape_pt_lon: Number,
    route: { type: Schema.Types.ObjectId, ref: 'Route' }
});

const routeSchema = new Schema({
    route_id: String,
    route_short_name: String,
    route_long_name: String,
    stop_times: [{ type: Schema.Types.ObjectId, ref: 'StopTime' }],
    routeCoordinates: [{ type: Schema.Types.ObjectId, ref: 'Shape' }]
});

const StopTime = mongoose.model('StopTime', stopTimeSchema);
const Shape = mongoose.model('Shape', shapeSchema);
const Route = mongoose.model('Route', routeSchema);


export  { StopTime, Shape, Route };