import {KafkaStreams, KStream} from "kafka-streams";
import {Kafka} from "kafkajs";
import {VehiclePositions} from "../DBmodels/vehiclepositions.js";
import {Route, Trip} from "../DBmodels/busline.js";
import mongoose from "mongoose";
import {congestionLevel} from "../congestionLevel.js";
const topic = 'gtfs-realtime-topic';


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});


const consumer = kafka.consumer({ groupId: 'gtfs-realtime-group' });

const run = async () => {

    await mongoose.connect('mongodb://localhost:27017/TotallySpiesBusPlan', {
        serverSelectionTimeoutMS: 60000
    });
    await VehiclePositions.deleteMany()
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
                if (vehicle.vehicle.currentStatus === "IN_TRANSIT_TO") {

                    // Check if the trip exists in the database
                    const existingTrip = await Trip.findOne({ trip_id: vehicle.vehicle.trip.tripId });
                    console.log("existing trip",existingTrip);
                    if (!existingTrip) {
                        console.log(`Trip ID ${vehicle.vehicle.trip_id} not in the database.`);
                        continue;  // Skip this vehicle
                    }

                    const existingPosition = await VehiclePositions.findOne({ currentTrip_id: existingTrip._id });
                    console.log("existing position",existingPosition);
                    if (existingPosition) {
                        // Update existing entry

                        // Calculate congestion level
                        const previousPosition = {position: existingPosition.current_position, timestamp: existingPosition.timestamp};
                        const currentPosition = {position: vehicle.vehicle.position, timestamp: vehicle.vehicle.timestamp};

                        console.log("previousPosition",previousPosition)
                        console.log("currentPosition",currentPosition)
                        const route = await Route.findOne({ _id: existingTrip.route_id });
                        if(existingPosition.current_position.latitude !== null || null !== vehicle.vehicle.position.longitude){
                            console.log("Stopsequence before uebergabe",vehicle.vehicle.currentStopSequence)
                            const vehicleInfo = {
                                trip_id: existingTrip.trip_id,
                                stopSequence: vehicle.vehicle.currentStopSequence,
                                positions: [previousPosition, currentPosition]
                            }
                            console.log("vehicleInfo",vehicleInfo)
                            console.log("vehicleInfo Position",vehicleInfo.positions)
                            console.log("routeID before calculating congestion",route.route_id)
                            const congestion =await congestionLevel(route.route_id, vehicleInfo);
                            console.log("congestion",congestion)
                            existingPosition.congestion_level.timestamp = new Date();
                            existingPosition.congestion_level.level = congestion;
                        }
                        existingPosition.previous_position.latitude = existingPosition.current_position.latitude;
                        existingPosition.previous_position.longitude = existingPosition.current_position.longitude;
                        existingPosition.current_position.latitude = vehicle.vehicle.position.latitude;
                        existingPosition.current_position.longitude = vehicle.vehicle.position.longitude;
                        existingPosition.timestamp = vehicle.vehicle.timestamp || new Date(); // Just making sure there's a fallback
                        existingPosition.current_stop_sequence = vehicle.vehicle.currentStopSequence;
                        existingPosition.current_status = vehicle.vehicle.current_status;
                        existingPosition.stop_id = vehicle.vehicle.currentStatus;


                         await existingPosition.save();





                    } else {
                        // Create new entry
                        const route = await Route.findOne({ _id: existingTrip.route_id });
                        const newPosition = new VehiclePositions({
                            currentTrip_id: existingTrip._id,
                            route: route,
                            timestamp: vehicle.vehicle.timestamp || new Date(),
                            current_position: {
                                latitude: vehicle.vehicle.position.latitude,
                                longitude: vehicle.vehicle.position.longitude
                            },
                            previous_position: {
                                latitude: null,
                                longitude: null
                            },
                            stop_id: vehicle.vehicle.stopId,
                            current_stop_sequence: vehicle.vehicle.currentStopSequence,
                            current_status: vehicle.vehicle.currentStatus,

                            congestion_level: {
                                timestamp: new Date(),  // Using current timestamp as default
                                level: 0  // Setting level as 0 by default
                            }
                        });
                        await newPosition.save();
                    }
                }
            }
           console.log("done");


        }
    });
};

run().catch(console.error);

