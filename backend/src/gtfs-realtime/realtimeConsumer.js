import {KafkaStreams, KStream} from "kafka-streams";
import {Kafka} from "kafkajs";

const config = {
    kafkaHost: "localhost:9092",
    groupId: "gtfs-realtime-consumer",
    workerPerPartition: 1,
    options: {
        sessionTimeout: 8000,
        protocol: ["roundrobin"],
        fromOffset: "earliest", // "earliest" start from the beginning
        fetchMaxBytes: 1024 * 100,
        fetchMinBytes: 1,
        fetchMaxWaitMs: 10
    }
};



const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const topic = 'gtfs-realtime-topic';
const consumer = kafka.consumer({ groupId: 'gtfs-realtime-group' });

const run = async () => {
    // Verbindung zum Konsumenten herstellen
    await consumer.connect();
    // Dem Topic abonnieren
    await consumer.subscribe({ topic });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
                partition,
            });
        },
    });
};

run().catch(console.error);

