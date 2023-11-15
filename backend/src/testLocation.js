import request from "request";
import * as fs from "fs";

const requestSettings = {
    method: 'GET',
    url: 'https://api.koda.trafiklab.se/KoDa/api/v2/gtfs-rt/klt/VehiclePositions?date=2021-01-01&key=gQpNjugJMEZZKu69pw3Sbz4PrLhZ0K_hVDGH5RAGUqk',
    encoding: null // This ensures that the response is treated as binary data
};

let outPutPath = "history.7z";

request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        fs.writeFile(outPutPath, body, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log("The file was saved!");
            }
        });
    } else {
        console.error("Error while downloading file:", error);
    }
});