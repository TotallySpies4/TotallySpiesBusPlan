import mongoose from "mongoose";
// import { calculateDistance } from './distanceHelper.js';

function calculateDistance(position1, position2) {
  const R = 6371; // Radius of the Earth in kilometers
  const [lat1, lon1] = position1;
  const [lat2, lon2] = position2;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Suppose already query all entities on the route segment and 1 trip has 2 vehicle positions to calculate speed
export async function calculateRouteAvgSpeed(vehiclePositions) {
  try {
    //Connect to MongoDB
    // await mongoose.connect('mongodb://localhost:27017/TotallySpiesBusPlan', {
    //     serverSelectionTimeoutMS: 60000,
    // });

  // Calculate the distance between the entity's position and the road segment
      let speedSum = 0;
      let speedCount = 0;
    
      for (let i = 1; i < vehiclePositions.length; i++) {
        const currentPosition = vehiclePositions[i].position;
        const previousPosition = vehiclePositions[i - 1].position;
        const distance = calculateDistance(currentPosition, previousPosition);
        const timeDifference = (vehiclePositions[i].timestamp - vehiclePositions[i - 1].timestamp)/1000;
    
        if (timeDifference !== 0) {
          const speed = (distance / timeDifference)*3600;
          speedSum += speed;
          speedCount++;
        }
      }
  
      if (speedCount > 0) {
        const averageSpeed = speedSum / speedCount;
        return averageSpeed;
      } else {
        throw new Error('Insufficient data to calculate average speed.');
      }
     
  }catch (error) {
    console.error("Error calculating speed:", error);
  }
}



 // Example usage:
 const vehiclePositions = [
  { position: [52.992, 6.570674], timestamp: 1698042500 }, 
  { position: [52.985916, 6.567918], timestamp: 1698084000 },
  { position: [52.982457, 6.56696], timestamp: 1698125000 },

];

async function calculateAndPrintSpeed() {
  try {
    const speed = await calculateRouteAvgSpeed(vehiclePositions);
    if (!isNaN(speed)) {
      console.log(`Average speed: ${speed} km/h`);
    } else {
      console.log('Unable to calculate average speed.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

calculateAndPrintSpeed();
