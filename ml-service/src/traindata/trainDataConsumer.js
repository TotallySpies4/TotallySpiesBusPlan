import {KafkaStreams, KStream} from "kafka-streams";
import {Kafka} from "kafkajs";
import {TrainData} from "../DBmodels/traindata.js";
import {Route, Trip, Speed} from "../../../backend/src/DBmodels/busline.js";
import mongoose from "mongoose";
const topic = 'train-data-topic';


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});


const consumer = kafka.consumer({ groupId: 'train-data-group' });

const run = async () => {

    await mongoose.connect('mongodb://localhost:27017/TotallySpiesBusPlan', {
        serverSelectionTimeoutMS: 60000
    });
    await consumer.connect();

    await consumer.subscribe({ topic });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const rawData = message.value.toString();
            const data = JSON.parse(rawData);
            /*for (const entity of data) {
                console.log(entity.vehicle);
           }*/

            //Somehow not working right now
           for (const vehicle of data) {
                //if (vehicle.vehicle.currentStatus === "IN_TRANSIT_TO" || vehicle.vehicle.currentStatus === "STOPPED_AT") {

                    // Check if the trip exists in the database
                    const existingTrip = await Trip.findOne({ trip_id: vehicle.vehicle.trip.tripId });
                    console.log("existing trip",existingTrip);
                    if (!existingTrip) {
                        console.log(`Trip ID ${vehicle.vehicle.trip_id} not in the database.`);
                        continue;  // Skip this vehicle
                    }

                    const speed = await Speed.findOne({ trip: existingTrip.trip_id });
                    console.log("existing route", route);

                    // Calculate the timestamp for one week ago
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                    if (new Date(vehicle.vehicle.timestamp) >= oneWeekAgo) {
                        const route = await Route.findOne({ _id: existingTrip.route_id });
                        const newData = {
                            route: route._id,
                            stop_times: [{
                                timestamp: new Date(vehicle.vehicle.timestamp) || new Date(),
                                trips: [{
                                    trip: existingTrip._id,
                                    location: location,
                                    speed: [{
                                        previousStop: speed.previousStop,
                                        currentStop: speed.currentStop,
                                        averageSpeed: speed.averageSpeed
                                    }]
                                }]
                            }]
                    };

                    const routeData = await RouteData.findOne({ route: route._id });
                    if (routeData) {
                        // Update existing entry
                        routeData.stop_times.push(newData);
                        await routeData.save();
                    } else {
                        // Create new entry
                        const newRouteData = new RouteData({
                            route: route._id,
                            stop_times: [newData]
                        });
                        await newRouteData.save();
                    }
                }
           }

           console.log("done");
        },
    });
};

run().catch(console.error);

