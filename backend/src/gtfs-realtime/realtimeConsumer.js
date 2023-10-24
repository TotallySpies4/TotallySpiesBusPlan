import {KafkaStreams, KStream} from "kafka-streams";
import {Kafka} from "kafkajs";
const topic = 'gtfs-realtime-topic';
const config = {
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
        () => [], /* Initialwert des Aggregators: ein leeres Array */
        (aggValue, newValue) => {
            aggValue.push(newValue);
            return aggValue;
        }
    );

console.log(windowedStream)
kafkaStreams.getKStream().start()



const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});


/**const consumer = kafka.consumer({ groupId: 'gtfs-realtime-group' });

const run = async () => {
    // Verbindung zum Konsumenten herstellen
    await consumer.connect();
    // Dem Topic abonnieren
    await consumer.subscribe({ topic });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const rawData = message.value.toString();
            const data = JSON.parse(rawData);

            for (const vehicle of data) {
                if(vehicle.vehicle.currentStatus === "IN_TRANSIT_TO"){
                    console.log(vehicle.vehicle)
                }

            }

        },
    });
};

run().catch(console.error);**/

