import mongoose from 'mongoose';

const stopTimeScheme = new mongoose.Schema({
    stop_id: String,
    arrival_time: String,
    departure_time: String,
    stop_sequence: Number

});

const busRouteScheme = new mongoose.Schema({
    route_id: String,
    route_short_name: String,
    route_long_name: String,
    stop_times: [stopTimeScheme]
});

const BusRoute = mongoose.model('BusRoute', busRouteScheme);

export {BusRoute};
