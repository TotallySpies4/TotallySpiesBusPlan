import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import {Kafka} from "kafkajs";
import axios from "axios";

const INTERVAL_MS = 60 * 1000;
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
            const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(response.data);
            const entities = feed.entity.map(entity => entity);
            console.log(entities[0].tripUpdate)
            console.log(entities[0].tripUpdate.stopTimeUpdate[0].arrival)
            await createTopic(topic);
            await sendToKafka(topic, entities);
            console.log(`Data sent to Kafka on topic: ${topic}`);
        }
    } catch (error) {
        console.error(`Error fetching and sending data for topic ${topic}:`, error);
    }
}


const amsterdamConfigTripUpdates = {
    url: 'http://gtfs.ovapi.nl/nl/tripUpdates.pb',
    topic: 'gtfs-realtime-amsterdam-tripUpdates'
};

const stockholmConfigTripUpdates = {
    url: "https://opendata.samtrafiken.se/gtfs-rt/sl/TripUpdates.pb?key=dace0c5b6dc643c898caf86761be7e86",
    topic: 'gtfs-realtime-stockholm-tripUpdates'
}

fetchAndSend(amsterdamConfigTripUpdates.url, amsterdamConfigTripUpdates.topic);
setInterval(() => fetchAndSend(amsterdamConfigTripUpdates.url, amsterdamConfigTripUpdates.topic), INTERVAL_MS);
fetchAndSend(stockholmConfigTripUpdates.url, stockholmConfigTripUpdates.topic);
setInterval(() => fetchAndSend(stockholmConfigTripUpdates.url, stockholmConfigTripUpdates.topic), INTERVAL_MS);

