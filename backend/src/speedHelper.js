import mongoose from "mongoose";
import { getBusDetails } from "./queryData/queryDbData.js";
import { calculateDistance, calculateTimeDifference } from "./distanceHelper.js";

// Function to calculate speed per road segment for a route
export async function calculateSpeedForRoute(routeId) {
  try {
    //Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/TotallySpiesBusPlan', {
        serverSelectionTimeoutMS: 60000,
    });

    // Get the details of the bus route
    const route = await getBusDetails("routeId");
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

      const distance = calculateDistance(previousStop.location.longitude, previousStop.location.latitude, currentStop.location.longitude, currentStop.location.latitude);
      const timeDifference = calculateTimeDifference(previousStop, currentStop);

      const speed = (distance / timeDifference)*3600;
      console.log(`Speed between ${previousStop.stop_name} and ${currentStop.stop_name}: ${speed} km/h`);
    }
  } catch (error) {
    console.error("Error calculating speed:", error);
  }

}