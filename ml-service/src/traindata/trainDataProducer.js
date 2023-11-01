import * as GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import request from 'request';
import { Kafka } from 'kafkajs';

const requestSettings = {
    method: 'GET',
    url: 'http://gtfs.ovapi.nl/nl/vehiclePositions.pb',
    encoding: null
};
const INTERVAL_MS =  60 * 1000;
const kafka = new Kafka({ brokers: ['kafka:19092'] });
const topic = 'train-data-topic';
const producer = kafka.producer();

async function createTopic() {
    const admin = kafka.admin();
    await admin.connect();
    const existingTopics = await admin.listTopics();

    if (!(existingTopics).includes(topic)) {
        await admin.createTopics({
            topics: [{
                topic: topic,
                numPartitions: 1,
            }],
        });
    }
    await admin.disconnect();
}

async function sendToKafka(data) {
    await producer.connect();
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(data) }],
    });
    console.log('Sent to Kafka');
    await producer.disconnect();
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
