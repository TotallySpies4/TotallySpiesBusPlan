
import {readFile} from "fs/promises";
import {GtfsStaticController} from "./controller/gtfsStaticController.js";

let gtfsStaticController = new GtfsStaticController();
const configData = JSON.parse(await readFile('./config.json', 'utf-8'));
const agencies = configData.agencies;

console.log(agencies.length)
console.log(agencies)

for (const config of agencies) {
    console.log(`Importing GTFS-Data for ${config.agencies[0].agency_id}`);

    await gtfsStaticController.importGtfsData(config)
        .then(() => {
            console.log(`Imported GTFS-Data for ${config.agencies[0].agency_id}`);


        })
    await gtfsStaticController.getRoutesWithStops(config)
        .then(() => {
            console.log('Routes with stops were fetched.')
            console.log('All routes were saved to MongoDB.');
            process.exit();
        });
}

