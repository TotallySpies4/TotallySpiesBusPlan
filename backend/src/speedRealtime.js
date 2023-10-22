import fetch from 'node-fetch';
import pkg from 'gtfs-realtime-bindings';
const { FeedMessage } = pkg;
import { calculateDistance } from './distanceHelper.js';

// Function to calculate the speed given two vehicle positions
function calculateSpeed(position1, position2, timeDifference) {
  const distance = calculateDistance(
    position1.latitude,
    position1.longitude,
    position2.latitude,
    position2.longitude
  );

  // Calculate speed in meters per second
  const speed = distance / timeDifference;

  return speed;
}

// Function to retrieve GTFS Realtime feed and process vehicle positions
async function processGtfsRealtimeFeed() {
  const feedUrl = 'http://gtfs.ovapi.nl/nl/vehiclePositions.pb'; 
  const desiredRouteId = '84928';
  const response = await fetch(feedUrl);
  const feedBuffer = await response.arrayBuffer();
  const feed = FeedMessage.decode(feedBuffer);
  const vehiclePositions = [];

  // Iterate over the feed entities
  for (const entity of feed.entity) {
    if (entity.vehicle && entity.vehicle.position && entity.vehicle.trip && entity.vehicle.trip.routeId) {
      const position = entity.vehicle.position;
      const currentStopSequence = entity.vehicle.currentStopSequence;
      const currentStatus = entity.vehicle.currentStatus;
      const stopId = entity.vehicle.stopId;
      const routeId = entity.vehicle.trip.routeId;

      if (routeId === desiredRouteId) {
        vehiclePositions.push({
          latitude: position.latitude,
          longitude: position.longitude,
          currentStopSequence,
          currentStatus,
          stopId,
          timestamp: entity.vehicle.timestamp
        });
      }
    }
  }

  // Sort vehicle positions by timestamp in ascending order
  vehiclePositions.sort((a, b) => a.timestamp - b.timestamp);

  // Calculate speed and determine bus stop intervals
  for (let i = 0; i < vehiclePositions.length - 1; i++) {
    const position1 = vehiclePositions[i];
    const position2 = vehiclePositions[i + 1];
    const timeDifference = (position2.timestamp - position1.timestamp) / 1000; // Convert to seconds

    if (timeDifference >= 300) { // 300 seconds = 5 minutes
      const speed = calculateSpeed(position1, position2, timeDifference);

      // Determine the bus stop interval
      // const startStopId = position1.stopId;
      // const endStopId = position2.stopId;
      // const interval = `From ${startStopId} to ${endStopId}`;

      console.log(`Speed: ${speed} m/s`);
      // console.log(`Interval: ${interval}`);
    }
  }
}

// Call the function to retrieve and process the GTFS Realtime feed every 5 minutes
setInterval(processGtfsRealtimeFeed, 5 * 60 * 1000); // 5 minutes in milliseconds
