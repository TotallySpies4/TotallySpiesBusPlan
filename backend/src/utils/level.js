/**
 * Method to calculate the congestion level
 * @param scheduleSpeed
 * @param route_avg_speed
 * @returns {number}
 */
export function level(scheduleSpeed, route_avg_speed){
    if (scheduleSpeed > route_avg_speed + 5) {
        return 0;  // green
    } else if (scheduleSpeed > route_avg_speed - 5) {
        return 1;  // yellow
    } else {
        return 2;  // red
    }
}