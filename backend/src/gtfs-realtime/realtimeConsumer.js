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

const kafkaStreams = new KafkaStreams(config);
const stream = kafkaStreams.getKStream("your-input-topic");

stream
    .map(message => {
        // Verarbeiten Sie die Rohdaten und berechnen Sie die Stau-Daten
        const processedData = yourProcessingFunction(message.value);
        return { key: message.key, value: processedData };
    })
    .to("your-output-topic");

kafkaStreams.start(() => {
    console.log("Kafka stream started.");
});