import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const stopTimeSchema = new Schema({
    agency_id: String,
    stop_id: String,
    stop_sequence: Number,
    arrival_time: String,
    departure_time: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    stop_name: String,
    shape_dist_traveled: Number,
    route: String,
    trip_id: String,
    prediction: {
        predLevelThirty : Number,
        predLevelSixty : Number

    }
});

const shapeSchema = new Schema({
    agency_id: String,
    shape_pt_lat: Number,
    shape_pt_lon: Number,
    shape_dist_traveled: Number,
    route: {type: Schema.Types.ObjectId, ref: 'Route'}  // Route reference
});

const speedSchema = new Schema({
    agency_id: String,
    previousStop: { type: Schema.Types.ObjectId, ref: 'StopTime' },
    currentStop: { type: Schema.Types.ObjectId, ref: 'StopTime' },
    route: {type: Schema.Types.ObjectId, ref: 'Route'},  // Route reference
    trip: String,  // Trip ID (assuming it's a string)
    averageSpeed: Number
});

const tripSchema = new Schema({
    agency_id: String,
    trip_id: String,
    route_id: String,
    stop_times: [{ type: Schema.Types.ObjectId, ref: 'StopTime' }],
    shapes: [{ type: Schema.Types.ObjectId, ref: 'Shape' }]
});

const routeSchema = new Schema({
    agency_id: String,
    route_id: String,
    route_short_name: String,
    route_long_name: String,
    trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }]
});

const StopTime = mongoose.model('StopTime', stopTimeSchema);
const Shape = mongoose.model('Shape', shapeSchema);
const Route = mongoose.model('Route', routeSchema);
const Trip = mongoose.model('Trip', tripSchema);
const Speed = mongoose.model('Speed', speedSchema);



export  { StopTime, Shape, Route, Speed, Trip };