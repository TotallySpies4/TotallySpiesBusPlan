import {KafkaStreams, KStream} from "kafka-streams";
import {Kafka} from "kafkajs";
import {VehiclePositions} from "../DBmodels/vehiclepositions.js";
import {Route, Trip} from "../DBmodels/busline.js";
const topic = 'gtfs-realtime-topic';
/**const config = {
    kafkaHost: "localhost:9092",
    groupId: "gtfs-realtime-group",
    // ... weitere Konfigurationen
};
const kafkaStreams = new KafkaStreams(config);
const rawStream = kafkaStreams.getKStream(topic);

const windowedStream = rawStream
    .filter(message => message.vehicle.currentStatus === "IN_TRANSIT_TO")
    .map(message => message.vehicle)
    .groupByKey(record => record.trip_id)
    .windowedByTime(1000 * 60 * 5) // 5 Minuten
    .aggregate(
        () => [],
        (aggValue, newValue) => {
            aggValue.push(newValue);
            return aggValue;
        }
    );

console.log(windowedStream)
kafkaStreams.getKStream().start()**/



const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});


const consumer = kafka.consumer({ groupId: 'gtfs-realtime-group' });

const run = async () => {
    // Verbindung zum Konsumenten herstellen
    await consumer.connect();
    // Dem Topic abonnieren
    await consumer.subscribe({ topic });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const rawData = message.value.toString();
            const data = JSON.parse(rawData);
            console.log(data);

            //Somehow not working right now
            for (const vehicle of data) {
                if (vehicle.vehicle.currentStatus === "IN_TRANSIT_TO") {

                    // Check if the trip exists in the database
                    const existingTrip = await Trip.findOne({ _id: vehicle.vehicle.trip_id });
                    if (!existingTrip) {
                        console.log(`Trip ID ${vehicle.vehicle.trip_id} not in the database.`);
                        continue;  // Skip this vehicle
                    }

                    const existingPosition = await VehiclePositions.findOne({ currentTrip_id: existingTrip._id });

                    if (existingPosition) {
                        // Update existing entry
                        existingPosition.position.latitude = vehicle.vehicle.position.latitude;
                        existingPosition.position.longitude = vehicle.vehicle.position.longitude;
                        existingPosition.timestamp = vehicle.vehicle.timestamp || new Date(); // Just making sure there's a fallback
                        existingPosition.current_stop_sequence = vehicle.vehicle.current_stop_sequence;
                        existingPosition.current_status = vehicle.vehicle.current_status;
                        existingPosition.stop_id = vehicle.vehicle.stop_id;
                        await existingPosition.save();
                    } else {
                        // Create new entry
                        const route = await Route.findOne({ _id: existingTrip.route_id });
                        const newPosition = new VehiclePositions({
                            currentTrip_id: existingTrip._id,
                            route: route, // Assuming the Trip model has a 'route' field you want to use
                            timestamp: vehicle.vehicle.timestamp || new Date(),
                            position: {
                                latitude: vehicle.vehicle.position.latitude,
                                longitude: vehicle.vehicle.position.longitude
                            },
                            speed: vehicle.vehicle.speed || null,  // Use the speed if available, else set as null
                            current_stop_sequence: vehicle.vehicle.current_stop_sequence,
                            current_status: vehicle.vehicle.current_status,
                            stop_id: vehicle.vehicle.stop_id,
                            congestion_level: {
                                timestamp: new Date(),  // Using current timestamp as default
                                level: 0  // Setting level as 0 by default
                            }
                        });
                        await newPosition.save();
                    }
                }
            }


        },
    });
};

run().catch(console.error);

