import { readFile } from 'fs/promises';
import * as GTFS from 'gtfs';
import mongoose from "mongoose";
import {Route, Shape, Speed, StopTime, Trip} from "./DBmodels/busline.js";
import {segmentAvgSpeedCalculator} from "./utils/speedCalculator.js";

export async function importGtfsData() {
    const config = JSON.parse(await readFile('./config.json', 'utf-8'));
    return GTFS.importGtfs(config);
}

export async function getRoutesWithStops() {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
                serverSelectionTimeoutMS: 60000
            }).then(() => console.log("Connected to MongoDB"))
                .catch((err) => console.error("MongoDB connection error:", err));

            await Route.deleteMany({});
            await StopTime.deleteMany({});
            await Shape.deleteMany({});
            await Speed.deleteMany({});
            await Trip.deleteMany({});

            let count = 0;
            const agencyOfInterest = "GVB";
            const routesForGVB = await GTFS.getRoutes({ agency_id: agencyOfInterest });
            const routes = routesForGVB.filter(route => route.route_type === 3).slice(0, 10);
            const numberOfRoutes = routes.length;
            console.log(`Found ${numberOfRoutes} routes for agency ${agencyOfInterest} bus`)

            for (const route of routes) {
                console.log(`Importing route ${route.route_id} in to the database (${count++}/${numberOfRoutes})`);
                let newRoute = new Route({
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

                        let newStopTime = new StopTime(stopTime);
                        await newStopTime.save();


                        tripInstance.stop_times.push(newStopTime._id);
                    }

                    const shapes = await GTFS.getShapes({trip_id: tripData.trip_id});
                    for (let shape of shapes) {
                        shape.route = newRoute._id;
                        let newShape = new Shape(shape);
                        await newShape.save();

                        tripInstance.shapes.push(newShape._id);
                    }

                    await tripInstance.save();

                    console.log(`Imported trip ${tripData.trip_id} in to the database`);
                    newRoute.trips.push(tripInstance._id);
                }

                await Route.updateOne({_id: newRoute._id}, newRoute);
            }
            resolve();

        } catch (err) {
            console.error("Error while importing data:", err);
            reject(err);
        }
    });
}
