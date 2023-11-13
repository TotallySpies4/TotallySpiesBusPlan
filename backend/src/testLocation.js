import request from "request";
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings";
import * as fs from "fs";
const requestSettings = {
    method: 'GET',
    url:'https://api.koda.trafiklab.se/KoDa/api/v2/gtfs-rt/klt/VehiclePositions?date=2021-01-01&key=gQpNjugJMEZZKu69pw3Sbz4PrLhZ0K_hVDGH5RAGUqk'



};
let outPutPath = "history.7z"
request(requestSettings, async function (error, response, body) {
    console.log("test2");

    if (!error && response.statusCode === 200) {
        const responseBody = Buffer.from(body, 'binary');
        console.log(response.statusCode);
        fs.writeFile(outPutPath, responseBody, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("The file was saved!");
        })

        //const feed = GtfsRealtimeBindings.default.transit_realtime.FeedMessage.decode(body);

    }
});