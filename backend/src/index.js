
import chokidar from 'chokidar';
import { saveRoutesToMongoDB } from './saveDataToMongoDB';
import { importGtfsData } from "./gtfsHelper";


const watcher = chokidar.watch('./gtfs/berlin.zip', { ignoreInitial: true });

watcher.on('change',(path, stats) => {
    console.log('GTFS-Data changed. Importing new data...');

    //Import GTFS-Data
    importGtfsData()
        .then(() => {
            console.log('GTFS-Data was imported successfully.');
            // after importing the data, save it to MongoDB
            return saveRoutesToMongoDB();
        })
        .then(() => {
            console.log('All routes were saved to MongoDB.');
            process.exit();
        })
        .catch(console.error);
});
