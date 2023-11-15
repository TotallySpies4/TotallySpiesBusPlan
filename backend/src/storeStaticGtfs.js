
import {readFile} from "fs/promises";
import {GtfsStaticController} from "./controller/gtfsStaticController.js";


let gtfsStaticController = new GtfsStaticController();
const configData = JSON.parse(await readFile('./config.json', 'utf-8'));
const agencies = configData.agencies;
for (const config of agencies) {
    console.log(`Importing GTFS-Data for ${config.agencies[0].agency_id}`);
    gtfsStaticController.importGtfsData(config)
        .then(() => {
            console.log(`Imported GTFS-Data for ${config.agencies[0].agency_id}`);
            gtfsStaticController.getRoutesWithStops(config)
                .then(() => {
                    console.log('Routes with stops were fetched.')
                    console.log('All routes were saved to MongoDB.');
                    process.exit();
                });

        })
        .catch(console.error);

}

