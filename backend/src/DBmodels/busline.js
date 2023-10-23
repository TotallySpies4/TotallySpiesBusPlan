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

const speedSchema = new Schema({
    previousStop: { type: Schema.Types.ObjectId, ref: 'StopTime' },
    currentStop: { type: Schema.Types.ObjectId, ref: 'StopTime' },
    route: { type: Schema.Types.ObjectId, ref: 'Route' },  // Route reference
    trip: String,  // Trip ID (assuming it's a string)
    averageSpeed: Number
});

const routeSchema = new Schema({
    route_id: String,
    trip_id: String,
    route_short_name: String,
    route_long_name: String,
    stop_times: [{ type: Schema.Types.ObjectId, ref: 'StopTime' }],
    routeCoordinates: [{ type: Schema.Types.ObjectId, ref: 'Shape' }]
});

const StopTime = mongoose.model('StopTime', stopTimeSchema);
const Shape = mongoose.model('Shape', shapeSchema);
const Route = mongoose.model('Route', routeSchema);
const Speed = mongoose.model('Speed', speedSchema);



export  { StopTime, Shape, Route, Speed };