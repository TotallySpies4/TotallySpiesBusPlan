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
    const route = await getBusDetails(routeId);
    if (!route) {
      console.log("Route not found");
    }

    const stopTimes = route[0].stop_times;
    const speeds = []

    for (let i = 1; i < stopTimes.length; i++) {
      const previousStop = stopTimes[i - 1];
      const currentStop = stopTimes[i];

      const distance = calculateDistance(previousStop.location.longitude, previousStop.location.latitude, currentStop.location.longitude, currentStop.location.latitude);
      const timeDifference = calculateTimeDifference(previousStop, currentStop);

      const speed = (distance / timeDifference)*3600;
        speeds.push({
          previousStop: previousStop.stop_id,
          currentStop: currentStop.stop_id,
            speed: speed
        })
    }
    return {route, speeds};

  } catch (error) {
    console.error("Error calculating speed:", error);
    return null;
  }
}
const result = await calculateSpeedForRoute(87881);
console.log(result);