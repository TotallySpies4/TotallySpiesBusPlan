import * as GTFS from 'gtfs';
import { readFile } from 'fs/promises';
const config = JSON.parse(await readFile('./config.json', 'utf-8'));
GTFS.importGtfs(config)
    .then(() => {
        console.log('GTFS-Daten erfolgreich importiert');
        console.log(GTFS.getStops())
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

