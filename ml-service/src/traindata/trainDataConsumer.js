
import {Kafka} from "kafkajs";
import {TrainData} from "../DBmodels/traindata.js";
import mongoose from "mongoose";
import {Trip} from "/app/shared/busline.js";
const topic = 'train-data-topic';

const kafka = new Kafka({
    clientId: 'my-app-topic2',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'train-data-group' });

const run = async () => {
    await mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
        serverSelectionTimeoutMS: 60000,
    }).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err));
    await consumer.connect();

    await consumer.subscribe({ topic });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const rawData = message.value.toString();
            const data = JSON.parse(rawData);

            const existingTrip = await Trip.findOne({ trip_id: '174631933' });
            console.log("existing trip", existingTrip);

            for (const vehicle of data) {
                try {


//
//                    if (!existingTrip) {
//                        console.log(`Trip ID ${vehicle.vehicle.trip.tripId} not in the database.`);
//                        continue;  // Skip this vehicle
//                    }
//
//                    const existingPosition = await TrainData.findOne({ currentTrip_id: existingTrip._id });
//                    console.log("existing position", existingPosition);
//
//                    if (existingPosition) {
//                        // Update existing entry
//
//                        // Calculate congestion level
//                        const previousPosition = { position: existingPosition.current_position, timestamp: existingPosition.timestamp };
//                        const currentPosition = { position: vehicle.vehicle.position, timestamp: vehicle.vehicle.timestamp };
//
//                        const route = await Route.findOne({ _id: existingTrip.route_id });
//
//                        if (existingPosition.current_position.latitude !== vehicle.vehicle.position.latitude ||
//                            existingPosition.current_position.longitude !== vehicle.vehicle.position.longitude) {
//                            const speed = await Speed.findOne({ trip: existingTrip.trip_id });
//
//                            existingPosition.stop_times.trips.speed.previousStop = speed.previousStop;
//                            existingPosition.stop_times.trips.speed.currentStop = speed.currentStop;
//                            existingPosition.stop_times.trips.speed.averageSpeed = speed.averageSpeed;
//                        }
//
//                        existingPosition.timestamp = vehicle.vehicle.timestamp || new Date(); // Just making sure there's a fallback
//
//                        await existingPosition.save();
//                    } else {
//                        // Calculate the timestamp for one week ago
//                        const oneWeekAgo = new Date();
//                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
//
//                        if (new Date(vehicle.vehicle.timestamp) >= oneWeekAgo) {
//                            const route = await Route.findOne({ _id: existingTrip.route_id });
//                            const speed = await Speed.findOne({ trip: existingTrip.trip_id });
//
//                            const newData = {
//                                route: route._id,
//                                stop_times: [{
//                                    timestamp: new Date(vehicle.vehicle.timestamp) || new Date(),
//                                    trips: [{
//                                        trip: existingTrip._id,
//                                        location: [{
//                                            latitude: vehicle.vehicle.position.latitude,
//                                            longitude: vehicle.vehicle.position.longitude
//                                        }],
//                                        speed: [{
//                                            previousStop: speed.previousStop,
//                                            currentStop: speed.currentStop,
//                                            averageSpeed: speed.averageSpeed
//                                        }]
//                                    }]
//                                }]
//                            };
//
//                            const trainData = await TrainData.findOne({ route: route._id });
//                            if (trainData) {
//                                // Update existing entry
//                                trainData.stop_times.push(newData);
//                                await trainData.save();
//                            } else {
//                                // Create a new entry
//                                const newTrainData = new TrainData({
//                                    route: route._id,
//                                    stop_times: [newData]
//                                });
//                                await newTrainData.save();
//                            }
//                        }
//                    }
                } catch (error) {
                    if (error.name === 'MongooseTimeoutError') {
                        console.log('MongoDB query timed out. Handle it gracefully.');
                        continue; // Skip this vehicle
                    } else {
                        console.error('An error occurred:', error);
                        // Handle other errors as needed
                    }
                }
            }
//
//            console.log("done");
        },
    });
};

run().catch(console.error);

