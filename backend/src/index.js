
import {getRoutesWithStops, importGtfsData} from "./gtfsHelper.js";


    console.log('GTFS-Data changed. Importing new data...');

    //Import GTFS-Data
    importGtfsData()
        .then(() => {
            console.log('GTFS-Data was imported successfully.');
            getRoutesWithStops()
                .then(() => {
                    console.log('Routes with stops were fetched.')
                    console.log('All routes were saved to MongoDB.');
                    process.exit();
                });

        })
        .catch(console.error);

