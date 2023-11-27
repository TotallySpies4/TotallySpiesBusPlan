import axios from "axios";
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings";
import {createTopic, sendToKafka} from "./realtimeProducer.js";

try {
    const response = await axios({
        method: 'GET',
        url: "https://opendata.samtrafiken.se/gtfs-rt/sl/TripUpdates.pb?key=dace0c5b6dc643c898caf86761be7e86",
        responseType: 'arraybuffer', // Wichtig für binäre Daten
        headers: {
            //'Accept': 'application/octet-stream',
            //'Content-Type': 'application/x-protobuf',
        },
    });
    console.log(`Fetched data for topic vehicleUpdates`);
    console.log(response.status);


    if (response.status === 200) {
        const feed = GtfsRealtimeBindings.default.transit_realtime.FeedMessage.decode(response.data);
        const entities = feed.entity.map(entity => entity);
        console.log(entities[0].tripUpdate.stopTimeUpdate)


        console.log(`Data sent to Kafka on topic: vehicleUpdates`);
    }
} catch (error) {
    console.error(`Error fetching and sending data for topic vehicalUpdate:`, error);
}
