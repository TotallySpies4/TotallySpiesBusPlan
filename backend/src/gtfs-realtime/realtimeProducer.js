const { Kafka } = require('kafkajs');
const { importGtfsRealtimeData } = require('./gtfsRealtimeHelper.js');

async function produceGtfsRealtimeData() {
    const kafka = new Kafka({ brokers: ['localhost:9092'] });

    const producer = kafka.producer();
    await producer.connect();

    const topic = 'gtfs-realtime-topic';

    const gtfsRealtimeData = await importGtfsRealtimeData();

    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(gtfsRealtimeData) }],
    });

    await producer.disconnect();
}

produceGtfsRealtimeData().catch(console.error);