import { readFile } from 'fs/promises';
import * as GTFS from 'gtfs';
import mongoose from "mongoose";
import {Route, Shape, Speed, StopTime} from "./DBmodels/busline.js";
import {calculateSpeedForRoute} from "./utils/avgSpeedCalculator.js";


/**
 * Method to import GTFS-Data from the zip-file in the gtfs-folder
 * @returns {Promise<void>}
 */
 export async function importGtfsData() {
    const config = JSON.parse(await readFile('./config.json', 'utf-8'));
    return GTFS.importGtfs(config);
}

/**
 * Method to get all routes with their stop times
 * @returns {Promise<*[]>}
 */
export async function getRoutesWithStops() {
    return new Promise(async (resolve, reject) => {


        try {

            //Connect to MongoDB
            await mongoose.connect('mongodb://localhost:27017/TotallySpiesBusPlan', {
                serverSelectionTimeoutMS: 60000
            })
                .then(() => console.log('Connected to MongoDB in getRoutesWithStops'))
                .catch(err => console.error('Could not connect to MongoDB:', err));

            await Route.deleteMany({});
            await StopTime.deleteMany({});
            await Shape.deleteMany({});
            await Speed.deleteMany({});

            //Get all routes
            const routes = await GTFS.getRoutes();
            for (const route of routes) {
                let newRoute = new Route({

                    route_id: route.route_id,
                    trip_id: null,
                    route_short_name: route.route_short_name,
                    route_long_name: route.route_long_name,
                    // Initially empty arrays for stop_times and routeCoordinates
                    stop_times: [],
                    routeCoordinates: []
                });

                // Save the route first, so we have an _id for reference

                await newRoute.save()

                const [firstTrip] = await GTFS.getTrips({route_id: route.route_id});
                if (firstTrip) {
                    newRoute.trip_id = firstTrip.trip_id;

                    const stopTimes = await GTFS.getStoptimes({trip_id: firstTrip.trip_id});
                    let previousStopTime = null;

                    for (let stopTime of stopTimes) {

                        const stop = await GTFS.getStops({stop_id: stopTime.stop_id});
                        stopTime.location = {
                            latitude: stop[0].stop_lat,
                            longitude: stop[0].stop_lon
                        };
                        stopTime.stop_name = stop[0].stop_name;
                        stopTime.route = newRoute._id;


                        let newStopTime = new StopTime(stopTime);
                        await newStopTime.save();

                        // Calculate and save speed if there's a previousStopTime
                        if (previousStopTime) {
                            const averageSpeed = await calculateSpeedForRoute(previousStopTime, newStopTime);
                            const speedEntry = new Speed({
                                previousStop: previousStopTime._id,
                                currentStop: newStopTime._id,
                                route: newRoute._id,
                                trip: firstTrip.trip_id,
                                averageSpeed: averageSpeed
                            });
                            await speedEntry.save();
                        }

                        previousStopTime = newStopTime;

                        // Add the stopTime's _id to the route's stop_times array
                        newRoute.stop_times.push(newStopTime._id);
                    }

                    const shapes = await GTFS.getShapes({trip_id: firstTrip.trip_id});
                    for (let shape of shapes) {
                        shape.route = newRoute._id;

                        let newShape = new Shape(shape);
                        await newShape.save();

                        // Add the shape's _id to the route's routeCoordinates array
                        newRoute.routeCoordinates.push(newShape._id);
                    }

                    // Finally, update the route with the references
                    await Route.updateOne({_id: newRoute._id}, newRoute);

                }
            }


        } catch (err) {
            console.error("Error while importing data:", err);
        }




    } );

}
