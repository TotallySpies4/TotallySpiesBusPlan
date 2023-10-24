import * as GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import request from 'request';
import { Kafka } from 'kafkajs';

const requestSettings = {
    method: 'GET',
    url: 'http://gtfs.ovapi.nl/nl/vehiclePositions.pb',
    encoding: null
};
const INTERVAL_MS = 5 * 60 * 1000;
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const topic = 'gtfs-realtime-topic';
const producer = kafka.producer();



const MAX_MESSAGE_SIZE = 1000000; // Limit the message size to 1MB

async function sendToKafka(data) {
    await producer.connect();

    const jsonString = JSON.stringify(data);
    console.log("Sending data to Kafka");
    console.log("Data size",Buffer.from(jsonString).length)
    if (Buffer.from(jsonString).length > MAX_MESSAGE_SIZE) {
        // If the message is too big, split it into chunks
        const chunks = splitDataIntoChunks(data, MAX_MESSAGE_SIZE);

        for (const chunk of chunks) {
            console.log(`Sending chunk of size ${Buffer.from(JSON.stringify(chunk)).length} to Kafka`);
            await producer.send({
                topic,
                messages: [{ value: JSON.stringify(chunk) }],
            });
        }
    } else {
        // If the message is small enough, send it as is
        await producer.send({
            topic,
            messages: [{ value: jsonString }],
        });
    }

    console.log("Data sent to Kafka");
    await producer.disconnect();
}

function splitDataIntoChunks(data, maxSize) {
    const chunks = [];
    let chunk = [];

    let currentSize = 0;
    for (const item of data) {
        const itemSize = Buffer.from(JSON.stringify(item)).length;

        if (currentSize + itemSize > maxSize) {
            chunks.push(chunk);
            chunk = [];
            currentSize = 0;
        }

        chunk.push(item);
        currentSize += itemSize;
    }

    if (chunk.length > 0) {
        chunks.push(chunk);
    }

    return chunks;
}


async function clearAndRecreateTopic() {
    const admin = kafka.admin();
    await admin.connect();

    const existingTopics = await admin.listTopics();
    console.log(existingTopics);
    if (existingTopics.includes(topic)) {
        console.log(`Topic ${topic} already exists. Deleting it...`);
        await admin.deleteTopics({
            topics: [topic],
            timeout: 1000,
        });

        await new Promise(resolve => setTimeout(resolve, 5000));

    }

    console.log("after delete",existingTopics);

    await admin.createTopics({
        topics: [{
            topic: topic,
            numPartitions: 1,
        }],
    });
    await admin.disconnect();
}

function fetchAndSend() {
    request(requestSettings, async function (error, response, body) {
        if (error || response.statusCode !== 200) {
            console.error("Failed to fetch data:", error || response.statusCode);
            return;
        }

        const feed = GtfsRealtimeBindings.default.transit_realtime.FeedMessage.decode(body);


        console.log(feed.entity);
        await clearAndRecreateTopic();
        await sendToKafka(feed.entity);
    });
}

fetchAndSend();
setInterval(fetchAndSend, INTERVAL_MS);

