
import { describe, it, jest, expect } from '@jest/globals';
import {congestionLevel, congestionLevelStockholm} from "../../../src/utils/congestionLevel.js";
import * as speedCalculator from '../../../src/utils/speedCalculator.js';
import * as level from "../../../src/utils/level.js";
import * as queryDataModule from "../../../src/queryData/fetchAverageSpeed.js";


describe('congestionLevel', () => {
  it('should correctly calculate congestion level for Stockholm', async () => {
    // Mock calculateScheduledSpeedStockholm und level
    const mockCalculateScheduledSpeedStockholm = jest.spyOn(speedCalculator, 'calculateScheduledSpeedStockholm');
    const mockLevel = jest.spyOn(level, 'level');

    // Mock-Daten für calculateScheduledSpeedStockholm
    const mockSpeedObject = {
      scheduleSpeed: 50,
      currentStop: 'stop1',
      nextStop: 'stop2'
    };
    mockCalculateScheduledSpeedStockholm.mockResolvedValue(mockSpeedObject);

    // Mock-Daten für level-Funktion
    mockLevel.mockImplementation((scheduleSpeed, speed) => {
      if (scheduleSpeed > speed + 5) {
        return 0;  // green
      } else if (scheduleSpeed > speed - 5) {
        return 1;  // yellow
      } else {
        return 2;  // red
      }
    });

    const tripID = 'trip123';
    const speed = 45; // Geschwindigkeit, die wir testen möchten
    const latitude = 59.3293;
    const longitude = 18.0686;
    const vehicleBearing = 100;

    const result = await congestionLevelStockholm(tripID, speed, latitude, longitude, vehicleBearing);

    expect(result.congestionLevel).toBe(1); // Erwartet wird Gelb, da die Geschwindigkeit nahe der Plan-Geschwindigkeit liegt
    expect(result.currentStop).toBe(mockSpeedObject.currentStop);
    expect(result.nextStop).toBe(mockSpeedObject.nextStop);

    // Überprüfe, ob die Mocks korrekt aufgerufen wurden
    expect(mockCalculateScheduledSpeedStockholm).toHaveBeenCalledWith(tripID, latitude, longitude, vehicleBearing);
    expect(mockLevel).toHaveBeenCalledWith(mockSpeedObject.scheduleSpeed, speed);
  });

  it('should calculate the correct congestion level', async () => {
    // Mock fetchAverageSpeed, realtimeAvgSpeedCalculator, and level
    const mockFetchAverageSpeed = jest.spyOn(queryDataModule, 'fetchAverageSpeed');
    const mockRealtimeAvgSpeedCalculator = jest.spyOn(speedCalculator, 'realtimeAvgSpeedCalculator');
    const mockLevel = jest.spyOn(level, 'level');

    // Mock data for fetchAverageSpeed
    const mockSpeedObject = {
      speedEntry: 40,
      previousStop: { stopName: 'PrevStop' },
      currentStop: { stopName: 'CurrStop' }
    };
    mockFetchAverageSpeed.mockResolvedValue(mockSpeedObject);

    // Mock data for realtimeAvgSpeedCalculator
    const routeAvgSpeed = 45;
    mockRealtimeAvgSpeedCalculator.mockResolvedValue(routeAvgSpeed);

    // Mock data for level function
    mockLevel.mockImplementation((scheduleSpeed, speed) => {
      if (scheduleSpeed > speed + 5) {
        return 0; // Green
      } else if (scheduleSpeed > speed - 5) {
        return 1; // Yellow
      } else {
        return 2; // Red
      }
    });

    const routeID = 'route123';
    const vehiclePosition = {
      trip_id: 'trip123',
      stopSequence: 2,
      positions: [{ /* position data */ }]
    };

    const result = await congestionLevel(routeID, vehiclePosition);

    // Assertions
    expect(result.congestionLevel).toBe(mockLevel(mockSpeedObject.speedEntry, routeAvgSpeed));
    expect(result.previousStop).toEqual(mockSpeedObject.previousStop);
    expect(result.currentStop).toEqual(mockSpeedObject.currentStop);

    // Verify that mocks are called correctly
    expect(mockFetchAverageSpeed).toHaveBeenCalledWith(routeID, vehiclePosition.trip_id, vehiclePosition.stopSequence);
    expect(mockRealtimeAvgSpeedCalculator).toHaveBeenCalledWith(vehiclePosition.positions);
    expect(mockLevel).toHaveBeenCalledWith(mockSpeedObject.speedEntry, routeAvgSpeed);
  });
});
