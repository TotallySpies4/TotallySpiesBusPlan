import {Trip} from "../DBmodels/busline.js";

/**
 * Helper Method to handle inactivity
 * @param route
 * @returns {Promise<*>}
 */
export async function handleInactivity(route) {
    return Trip.findOne({_id: route.trips[0]}).populate('stop_times').populate('shapes');
}