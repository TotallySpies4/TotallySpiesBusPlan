import { congestionLevel, congestionLevelStockholm, level } from '../../../src/utils/congestionLevel';
import { calculateScheduledSpeedStockholm, realtimeAvgSpeedCalculator } from '../../../src/utils/speedCalculator';
import { fetchAverageSpeed } from '../../../src/queryData/queryDbData';
import {describe, it, jest} from "@jest/globals";

// Mocking dependencies
jest.mock('../../../src/utils/speedCalculator');
jest.mock('../../../src/queryData/queryDbData');

describe('congestionLevel', () => {
  it('should calculate congestion level for a route segment', async () => {
    // Mock data
    const routeID = 'someRouteID';
    const vehiclePosition = {
      trip_id: 'someTripID',
      stopSequence: 42,
      positions: [
        {
          position: { latitude: 0, longitude: 0 },
          timestamp: new Date(),
        },
        {
          position: { latitude: 1, longitude: 1 },
          timestamp: new Date(),
        },
      ],
    };

    // Mock the fetchAverageSpeed function
    fetchAverageSpeed.mockResolvedValue({
      speedEntry: 30, // Replace with the actual scheduled speed
      previousStop: 'previousStopID',
      currentStop: 'currentStopID',
    });

    // Mock the realtimeAvgSpeedCalculator function
    realtimeAvgSpeedCalculator.mockResolvedValue(25);

    // Call the congestionLevel function
    const result = await congestionLevel(routeID, vehiclePosition);

    // Assertions
    expect(result).toEqual({
      congestionLevel: 1,
      previousStop: 'previousStopID',
      currentStop: 'currentStopID',
    });
  });
});

describe('congestionLevelStockholm', () => {
  it('should calculate congestion level for Stockholm', async () => {
    // Mock data
    const tripID = 'someTripID';
    const speed = 40;
    const latitude = 1;
    const longitude = 1;
    const vehicleBearing = 90;

    // Mock the calculateScheduledSpeedStockholm function
    calculateScheduledSpeedStockholm.mockResolvedValue({
      scheduleSpeed: 35, // Replace with the actual scheduled speed
      currentStop: 'currentStopID',
      nextStop: 'nextStopID',
    });

    // Call the congestionLevelStockholm function
    const result = await congestionLevelStockholm(tripID, speed, latitude, longitude, vehicleBearing);

    // Assertions
    expect(result).toEqual({
      congestionLevel: 1,
      currentStop: 'currentStopID',
      nextStop: 'nextStopID',
    });
  });
});

describe('level', () => {
  it('should calculate the congestion level based on scheduleSpeed and route_avg_speed', () => {
    // Mock data
    const scheduleSpeed = 30;
    const route_avg_speed = 25;

    // Call the level function
    const result = level(scheduleSpeed, route_avg_speed);

    // Assertions
    expect(result).toBe(1);
  });
});
