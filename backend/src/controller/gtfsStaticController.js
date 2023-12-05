import * as GTFS from 'gtfs';
import mongoose from "mongoose";
import {Route, Shape, Speed, StopTime, Trip} from "../DBmodels/busline.js";
import {SegmentSpeedPrediction} from "../DBmodels/segmentSpeedPrediction.js";
import {calculateScheduledSpeed} from "../utils/speedCalculator.js";
import {getShapesBetweenStops} from "../utils/shapesUtilSet.js";


export class GtfsStaticController {

    constructor() {
    }
    async importGtfsData(config) {
        console.log('In importGtfsData')
        return GTFS.importGtfs(config);
    }

    async getRoutesWithStops( agencyConfig )  {
        try {
                await mongoose.connect(agencyConfig.agencies[0].mongoUrl, {
                    serverSelectionTimeoutMS: 60000
                }).then(() => console.log("Connected to MongoDB"))
                    .catch((err) => console.error("MongoDB connection error:", err));

                let count = 0;
                let busRouteType;
                let prediction;
                let routeSL = ["25M", "26C", "968", "969", "961", "25F", "26M"];
                const agencyOfInterest = agencyConfig.agencies[0].agency_id;
                if(agencyOfInterest === "GVB"){
                    busRouteType = 3;
                    prediction = false;
                }
                else if(agencyOfInterest === "14010000000001001"){
                    busRouteType = 700;
                    prediction = true;
                }

                await Route.deleteMany({agency_id: agencyOfInterest});
                await StopTime.deleteMany({agency_id: agencyOfInterest});
                await Shape.deleteMany({agency_id: agencyOfInterest});
                await Speed.deleteMany({agency_id: agencyOfInterest});
                await Trip.deleteMany({agency_id: agencyOfInterest});
                await SegmentSpeedPrediction.deleteMany();



                const routesForAgency = await GTFS.getRoutes({ agency_id: agencyOfInterest });

                let filteredRoutes = routesForAgency.filter(route =>
                    route.route_type === busRouteType && route.route_long_name
                );
                if(agencyOfInterest === "14010000000001001"){
                    filteredRoutes = filteredRoutes.filter(route =>
                        route.route_short_name && routeSL.includes(route.route_short_name))

                }

                const routes = filteredRoutes.slice(0, 10);
                const numberOfRoutes = routes.length;
                console.log(`Found ${numberOfRoutes} routes for agency ${agencyOfInterest} bus`)

                for (const route of routes) {
                    console.log(`Importing route ${route.route_id} in to the database (${count++}/${numberOfRoutes})`);
                    let newRoute = new Route({
                        agency_id: agencyOfInterest,
                        route_id: route.route_id,
                        route_short_name: route.route_short_name,
                        route_long_name: route.route_long_name,
                        trips: []
                    });
                    await newRoute.save();

                    const tripsForThisRoute = await GTFS.getTrips({route_id: route.route_id});
                    console.log(`Found ${tripsForThisRoute.length} trips for route ${route.route_id}`)

                    for (let tripData of tripsForThisRoute) {
                        let tripInstance = new Trip({
                            agency_id: agencyOfInterest,
                            trip_id: tripData.trip_id,
                            route_id: newRoute._id,
                            stop_times: [],
                            shapes: []
                        });

                        const stopTimes = await GTFS.getStoptimes({trip_id: tripData.trip_id});

                        for (let stopTime of stopTimes) {
                            const stop = await GTFS.getStops({stop_id: stopTime.stop_id});
                            stopTime.location = {
                                latitude: stop[0].stop_lat,
                                longitude: stop[0].stop_lon
                            };
                            stopTime.stop_name = stop[0].stop_name;
                            stopTime.route = newRoute._id;
                            stopTime.trip_id = tripInstance._id;
                            stopTime.agency_id = agencyOfInterest;

                            let newStopTime = new StopTime(stopTime);
                            await newStopTime.save();



                            tripInstance.stop_times.push(newStopTime._id);
                        }


                        const shapes = await GTFS.getShapes({trip_id: tripData.trip_id});
                        for (let shape of shapes) {
                            shape.route = newRoute._id;
                            shape.agency_id = agencyOfInterest;
                            let newShape = new Shape(shape);
                            await newShape.save();

                            tripInstance.shapes.push(newShape._id);
                        }

                        if(prediction){
                            for (let i = 0; i < stopTimes.length - 1; i++) {
                                const previousStop = stopTimes[i];
                                const currentStop = stopTimes[i + 1];

                                const averageSpeed = calculateScheduledSpeed(previousStop, currentStop);
                                console.log("averageSpeed",averageSpeed)
                                const predShape = await getShapesBetweenStops(shapes, previousStop, currentStop);
                                const predShapeID = predShape.map(shape => mongoose.Types.ObjectId(shape._id));
                                let segmentSpeedPrediction = new SegmentSpeedPrediction({
                                    trip_id: tripData.trip_id,
                                    previous_stop_id: i === 0 ? stopTimes[0].stop_id : stopTimes[i - 1].stop_id,
                                    next_stop_id: stopTimes[i + 1].stop_id,
                                    segment_number: i + 1,
                                    average_speed: averageSpeed,
                                    speed_30_min_prediction: {speed: null, level: null},
                                    speed_60_min_prediction: {speed: null, level: null},
                                    shapes: predShapeID
                                });
                                await segmentSpeedPrediction.save();
                            }
                        }


                        await tripInstance.save();

                        console.log(`Imported trip ${tripData.trip_id} in to the database`);
                        newRoute.trips.push(tripInstance._id);
                    }

                    await Route.updateOne({_id: newRoute._id}, newRoute);
                }

            } catch (err) {
                console.error("Error while importing data:", err);
            }
    }

}
