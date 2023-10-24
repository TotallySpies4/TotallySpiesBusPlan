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


    console.log("Data sent to Kafka");
    await producer.disconnect();
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
        if (!error && response.statusCode == 200) {
            const feed = GtfsRealtimeBindings.default.transit_realtime.FeedMessage.decode(body);
            const entities = [];
            feed.entity.forEach(entity => {
                entities.push(entity);
            });

            console.log(entities);
            await createTopic();
            await sendToKafka(entities);
        }
    });
}

fetchAndSend();
setInterval(fetchAndSend, INTERVAL_MS);

