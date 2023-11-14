
import {getRoutesWithStops, importGtfsData} from "./controller/gtfsStaticController.js";
import {readFile} from "fs/promises";

const configs = JSON.parse(await readFile('./config.json', 'utf-8'));
for (const config of configs) {
    console.log(`Importing GTFS-Data for ${config.agency_id}`);
    importGtfsData(config)
        .then(() => {
            console.log(`Imported GTFS-Data for ${config.agency_id}`);
            getRoutesWithStops(config)
                .then(() => {
                    console.log('Routes with stops were fetched.')
                    console.log('All routes were saved to MongoDB.');
                    process.exit();
                });

        })
        .catch(console.error);

}

