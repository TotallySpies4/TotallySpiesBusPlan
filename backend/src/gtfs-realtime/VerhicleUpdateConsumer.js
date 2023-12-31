import {Kafka} from "kafkajs";
import mongoose from "mongoose";
import {AmsterdamVehicleDataProcessor} from "./AmsterdamVehicleDataProcessor.js";
import {StockholmVehicleDataProcessor} from "./StockholmVehicleDataProcessor.js";
import {Trip} from "../DBmodels/busline.js";
import {TripUpdate} from "../DBmodels/tripUpdate.js";

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka:19092']
});

async function setupConsumerForCity(topic,city) {
    const consumer = kafka.consumer({groupId: topic});

    await mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
        serverSelectionTimeoutMS: 60000
    });
    await TripUpdate.deleteMany();
    await consumer.connect();
    await consumer.subscribe({topic});

    let processor;
    if (city === 'amsterdam') {
        processor = new AmsterdamVehicleDataProcessor();
    } else if (city === 'stockholm') {
        processor = new StockholmVehicleDataProcessor();
    }

    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            const rawData = message.value.toString();
            const data = JSON.parse(rawData);


            for (const tripUpdate of data) {
                if (!tripUpdate || !tripUpdate.tripUpdate || !tripUpdate.tripUpdate.trip) {
                    console.error('Invalid vehicle data format:', vehicle);
                    continue;
                }

                if (!tripUpdate.tripUpdate.trip.tripId) {
                    //console.error('Trip ID is undefined for vehicle:', vehicle);
                    continue; // Skip this iteration because tripId is undefined
                }

                //console.log("vehicleID", vehicle);
                const existingTrip = await Trip.findOne({trip_id: tripUpdate.tripUpdate.trip.tripId});
                //console.log("existing trip", existingTrip);
                if (!existingTrip) {
                    //console.log(`Trip ID ${vehicle.vehicle.trip.tripId} not in the database.`);
                    continue;  // Skip this vehicle
                }

                const existingTripUpdate = await TripUpdate.findOne({trip_id: existingTrip.trip_id});
                //console.log("existing position", existingPosition);
                if (existingTripUpdate) {

                    // Update existing entry

                    await processor.updateTrip(existingTripUpdate, tripUpdate);
                    await existingTripUpdate.save();


                } else {
                    // Create new entry
                    const newTripUpdate = processor.createNewTripUpdate(tripUpdate, city);
                    await newTripUpdate.save();
                }
            }
            console.log("done");


        }})
    }

async function run() {
    try {
        await setupConsumerForCity('gtfs-realtime-amsterdam-tripUpdates','amsterdam');
        await setupConsumerForCity('gtfs-realtime-stockholm-tripUpdates','stockholm');
        // Add more cities as needed
    } catch (error) {
        console.error(error);
    }
}

run();