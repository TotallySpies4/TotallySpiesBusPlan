import mongoose from 'mongoose';
const coordinateScheme = new mongoose.Schema({
    latitude: Number,
    longitude: Number
}, { _id: false });  // This ensures that Mongoose doesn't create a unique _id for each coordinate

const stopTimeScheme = new mongoose.Schema({
    stop_id: String,
    arrival_time: String,
    departure_time: String,
    stop_sequence: Number,
    location: {
        latitude: Number,
        longitude: Number
    },
    stop_name: String

});

const busRouteScheme = new mongoose.Schema({
    route_id: String,
    route_short_name: String,
    route_long_name: String,
    stop_times: [stopTimeScheme],
    routeCoordinates: [coordinateScheme]

});

const BusRoute = mongoose.model('BusRoute', busRouteScheme);

export {BusRoute};
