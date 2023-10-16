import { readFile } from 'fs/promises';
import * as GTFS from 'gtfs';

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
export async function getRoutesWithStops() {
    const routes = await GTFS.getRoutes();
    let groupedByRouteName = {};

    for (const route of routes) {
        //if (route.route_type !== '3') continue;
        // Überspringen Sie den Eintrag, wenn route_short_name bereits existiert
        if (groupedByRouteName[route.route_short_name]) continue;

        const [firstTrip] = await GTFS.getTrips({ route_id: route.route_id });

        if (firstTrip) {
            const stopTimes = await GTFS.getStoptimes({ trip_id: firstTrip.trip_id });

            for (let i = 0; i < stopTimes.length; i++) {
                const stop = await GTFS.getStops({ stop_id: stopTimes[i].stop_id });
                //console.log(stop)
                stopTimes[i].location = {
                    latitude: stop[0].stop_lat,
                    longitude: stop[0].stop_lon
                };
                stopTimes[i].stop_name = stop[0].stop_name;


            }
            // Shapes-Daten für die aktuelle Fahrt (Trip) abrufen
            const shapes = await GTFS.getShapes({ trip_id: firstTrip.trip_id });

            // Die Koordinaten für die Route aus den Shapes-Daten extrahieren
            const routeCoordinates = shapes.map(shape => {
                return {
                    latitude: shape.shape_pt_lat,
                    longitude: shape.shape_pt_lon
                };
            });

            console.log(stopTimes)
            groupedByRouteName[route.route_short_name] = {
                route_id: route.route_id,
                route_short_name: route.route_short_name,
                route_long_name: route.route_long_name,
                stop_times: stopTimes,
                routeCoordinates: routeCoordinates
            };
        }
    }

    return Object.values(groupedByRouteName);
}

