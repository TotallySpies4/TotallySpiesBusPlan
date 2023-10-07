import { readFile } from 'fs/promises';
import GTFS from 'gtfs';

/**
 * Method to import GTFS-Data from the zip-file in the gtfs-folder
 * @returns {Promise<void>}
 */
 export async function importGtfsData() {
    const config = JSON.parse(await readFile('./config.json', 'utf-8'));
    return GTFS.importGtfs(config);
}

/**
 * Method to get all routes with their stop times
 * @returns {Promise<*[]>}
 */
export async function getRoutesWithStopTimes() {
    const routes = await GTFS.getRoutes();
    let routesWithStops = [];

    for (const route of routes) {
        const trips = await GTFS.getTrips({ route_id: route.route_id });
        let allStopTimes = [];

        for (const trip of trips) {
            const stopTimes = await GTFS.getStoptimes({ trip_id: trip.trip_id });
            allStopTimes = allStopTimes.concat(stopTimes);
        }

        routesWithStops.push({
            route_id: route.route_id,
            route_short_name: route.route_short_name,
            route_long_name: route.route_long_name,
            stop_times: allStopTimes
        });
    }

    return routesWithStops;
}

