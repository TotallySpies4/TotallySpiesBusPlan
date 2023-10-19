import {Route} from "../DBmodels/busline.js";

async function getBusAllBusline(){
    return Route.find({});
}

async function getBusDetails(routeID){
    return Route.find({route_id: routeID})
        .populate('stop_times')
        .populate('routeCoordinates');
}

export {getBusAllBusline, getBusDetails};