import {calculateDistance} from "./speedHelper";
import { readFileSync } from "fs";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

// Define the path to the vehiclePosition.pb file
const vehiclePositionPbFilePath = "<http://gtfs.ovapi.nl/nl/vehiclePositions.pb>";

// Read the contents of the vehiclePosition.pb file
const vehiclePositionData = fs.readFileSync(vehiclePositionPbFilePath);

// Parse the vehiclePosition data using the gtfs-realtime-bindings library
const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(vehiclePositionData);

// Access the vehicle positions
const vehiclePositions = feed.entity;

// Calculate speed in 5-minute intervals
const speedIntervals = {};

for (const vehicle of vehiclePositions) {
  const position = vehicle.vehicle;
  const tripId = position.trip.tripId;
  const timestamp = position.timestamp.low;

  // Extract relevant information from the vehicle position
  const latitude = position.position.latitude;
  const longitude = position.position.longitude;

  // Match trip ID with GTFS schedule to get scheduled stops
  const stops = gtfsScheduleData[tripId].stops;

  // Iterate over the stops to calculate speed in intervals
  for (let i = 1; i < stops.length; i++) {
    const currentStop = stops[i];
    const previousStop = stops[i - 1];

    // Calculate the distance between current and previous stops
    const distance = calculateDistance(
      previousStop.latitude,
      previousStop.longitude,
      currentStop.latitude,
      currentStop.longitude
    );

    // Calculate the time difference between stops
    const timeDiff = currentStop.timestamp - previousStop.timestamp;

    // Calculate the speed
    const speed = (distance / timeDiff) * 3600; // Convert to kilometers per hour

    // Calculate the 5-minute interval timestamp
    const intervalTimestamp = Math.floor(timestamp / (5 * 60)) * (5 * 60);

    // Add speed to the corresponding interval
    if (!speedIntervals[intervalTimestamp]) {
      speedIntervals[intervalTimestamp] = [];
    }
    speedIntervals[intervalTimestamp].push(speed);
  }
}

console.log(speedIntervals);