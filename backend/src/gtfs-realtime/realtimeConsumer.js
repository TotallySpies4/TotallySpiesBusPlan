import {Kafka} from "kafkajs";
import mongoose from "mongoose";

import {congestionLevel, congestionLevelStockholm} from "../utils/congestionLevel.js";
import {VehiclePositions} from "../DBmodels/vehiclepositions.js";
import {Route, Trip} from "../DBmodels/busline.js";

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka:19092']
});

async function setupConsumerForCity(topic,city) {
    const consumer = kafka.consumer({groupId: `gtfs-realtime-group-${topic}`});

    await mongoose.connect('mongodb://mongodb:27017/TotallySpiesBusPlan', {
        serverSelectionTimeoutMS: 60000
    });
    await VehiclePositions.deleteMany();
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


            for (const vehicle of data) {
                //if (vehicle.vehicle.currentStatus === "IN_TRANSIT_TO" || vehicle.vehicle.currentStatus === "STOPPED_AT") {

                if (!vehicle || !vehicle.vehicle || !vehicle.vehicle.trip) {
                    console.error('Invalid vehicle data format:', vehicle);
                    continue; // Skip this iteration because the structure is not as expected
                }

                // Now you can safely check for 'tripId'
                if (!vehicle.vehicle.trip.tripId) {
                    console.error('Trip ID is undefined for vehicle:', vehicle);
                    continue; // Skip this iteration because tripId is undefined
                }

                // Check if the trip exists in the database

                    console.log("vehicleID", vehicle);
                    const existingTrip = await Trip.findOne({trip_id: vehicle.vehicle.trip.tripId});
                    console.log("existing trip", existingTrip);
                    if (!existingTrip) {
                        console.log(`Trip ID ${vehicle.vehicle.trip.tripId} not in the database.`);
                        continue;  // Skip this vehicle
                    }

                    const existingPosition = await VehiclePositions.findOne({currentTrip_id: existingTrip._id});
                     console.log("existing position", existingPosition);
                     if (existingPosition) {
                    // Update existing entry

                    await processor.updateVehicle(vehicle, existingPosition, existingTrip);

                    await existingPosition.save();


                } else {
                    // Create new entry
                    const route = await Route.findOne({_id: existingTrip.route_id});

                    const newPosition = processor.createNewVehicle(vehicle.vehicle, existingTrip, route, city);
                    await newPosition.save();
                }
                     // }


            }
            console.log("done");


        }

    });

}


async function run() {
    try {
        await setupConsumerForCity('gtfs-realtime-amsterdam','amsterdam');
        await setupConsumerForCity('gtfs-realtime-stockholm','stockholm');
        // Add more cities as needed
    } catch (error) {
        console.error(error);
    }
}

run();


