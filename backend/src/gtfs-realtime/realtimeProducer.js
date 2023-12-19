import axios from 'axios';
import * as GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { Kafka } from 'kafkajs';

const INTERVAL_MS = 30 * 1000;
const kafka = new Kafka({ brokers: ['kafka:19092'] });



export async function createTopic(topic) {
    const admin = kafka.admin();
    await admin.connect();
    const existingTopics = await admin.listTopics();

    if (!existingTopics.includes(topic)) {
        await admin.createTopics({
            topics: [{ topic, numPartitions: 1 }],
        });
    }
    await admin.disconnect();
}

export async function sendToKafka(topic, data) {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(data) }],
    });
    console.log(`Sent to Kafka on topic: ${topic}`);
    await producer.disconnect();
}

export async function fetchAndSend(url, topic) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer', // Wichtig für binäre Daten
            headers: {
                //'Accept': 'application/octet-stream',
                //'Content-Type': 'application/x-protobuf',
            },
        });
        console.log(`Fetched data for topic ${topic}`);
        console.log(response.status);


        if (response.status === 200) {
            const feed = GtfsRealtimeBindings.default.transit_realtime.FeedMessage.decode(response.data);
            const entities = feed.entity.map(entity => entity);

            console.log(entities[0])
            await createTopic(topic);
            await sendToKafka(topic, entities);
            console.log(`Data sent to Kafka on topic: ${topic}`);
        }
    } catch (error) {
        console.error(`Error fetching and sending data for topic ${topic}:`, error);
    }
}


// City configurations
const amsterdamConfig = {
    url: 'https://gtfs.ovapi.nl/nl/vehiclePositions.pb',
    topic: 'gtfs-realtime-amsterdam'
};

const stockholmConfig = {
    url: 'https://opendata.samtrafiken.se/gtfs-rt/sl/VehiclePositions.pb?key=dace0c5b6dc643c898caf86761be7e86',
    topic: 'gtfs-realtime-stockholm'
};

export function startFetchingData() {
    fetchAndSend(amsterdamConfig.url, amsterdamConfig.topic);
    setInterval(() => fetchAndSend(amsterdamConfig.url, amsterdamConfig.topic), INTERVAL_MS);

    fetchAndSend(stockholmConfig.url, stockholmConfig.topic);
    setInterval(() => fetchAndSend(stockholmConfig.url, stockholmConfig.topic), INTERVAL_MS);
}

//startFetchingData();
