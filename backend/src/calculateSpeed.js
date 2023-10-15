import { getRoutesWithStops } from "./gtfsHelper.js";

// Function to calculate speed per road segment for a route
async function calculateSpeedForRoute(routeId) {
  // Retrieve the route and its stop times
  const routesWithStops = await getRoutesWithStops();
  const route = routesWithStops.find((r) => r.route_id === routeId);

  if (!route) {
    console.log("Route not found");
    return;
  }

  const stopTimes = route.stop_times;

  // Perform the speed calculation logic here
  // Iterate through the stop times and calculate the speed for each road segment

  // Example: Calculate speed between consecutive stops
  for (let i = 1; i < stopTimes.length; i++) {
    const previousStop = stopTimes[i - 1];
    const currentStop = stopTimes[i];

    const distance = calculateDistance(previousStop.location, currentStop.location);
    const timeDifference = calculateTimeDifference(previousStop, currentStop);

    const speed = distance / timeDifference;
    console.log(`Speed between ${previousStop.stop_name} and ${currentStop.stop_name}: ${speed} km/h`);
  }
}

// Helper functions for distance between two locations using the Haversine formula
function calculateDistance(location1, location2) {
  const radius = 6371; // Radius of the Earth in kilometers

  const lat1 = location1.latitude;
  const lon1 = location1.longitude;
  const lat2 = location2.latitude;
  const lon2 = location2.longitude;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = radius * c;
  //The result is returned in kilometers.
  return distance;
}
// Helper function to convert degrees to radians
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Helper function to calculate the time difference between two stop times
function calculateTimeDifference(stop1, stop2) {
  const timeFormat = "HH:mm:ss"; // Specify the time format used in the stop times

  const departureTime1 = parseTime(stop1.departure_time, timeFormat);
  const arrivalTime2 = parseTime(stop2.arrival_time, timeFormat);

  // Calculate the time difference in hours
  const timeDifference = (arrivalTime2 - departureTime1) / (1000*60*60);
  return timeDifference;
}
// Helper function to parse a time string into a Date object
function parseTime(timeString, format) {
  const [hours, minutes, seconds] = timeString.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
}
// Usage example: Calculate speed for a specific route
const routeId = "87-1-j23-2";
calculateSpeedForRoute(routeId);