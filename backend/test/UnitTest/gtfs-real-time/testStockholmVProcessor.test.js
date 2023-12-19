import { StockholmVehicleDataProcessor } from '../../../src/gtfs-realtime/StockholmVehicleDataProcessor';
import { IVehicleDataProcessor } from '../../../src/gtfs-realtime/IVehicleDataProcessor';
import { VehiclePositions } from '../../../src/DBmodels/vehiclepositions.js';
import { TripUpdate } from '../../../src/DBmodels/tripUpdate.js';
import { congestionLevelStockholm } from '../../../src/utils/congestionLevel';
import {beforeEach, describe, expect, it, jest} from "@jest/globals";

// Mocking dependencies
jest.mock('../../../src/DBmodels/vehiclepositions.js');
jest.mock('../../../src/DBmodels/tripUpdate.js');
jest.mock('../../../src/utils/congestionLevel');

describe('StockholmVehicleDataProcessor', () => {
  let processor;

  beforeEach(() => {
    // Reset mocks and create a new instance of the processor for each test
    jest.clearAllMocks();
    processor = new StockholmVehicleDataProcessor();
  });

    it('should create a new VehiclePositions instance', () => {
      const vehicle = {
        vehicle: {
          timestamp: new Date(),
          position: {
            latitude: 59.3293,
            longitude: 18.0686,
          },
        },
      };
      const existingTrip = {
        _id: 'existingTripId',
      };
      const route = {
        _id: 'existingRouteId',
      };
      const city = 'Stockholm';

      const result = processor.createNewVehicle(vehicle, existingTrip, route, city);

      // Check if the constructor was called with the expected arguments
      expect(VehiclePositions).toHaveBeenCalledWith({
        city: 'Stockholm',
        currentTrip_id: 'existingTripId',
        route: 'existingRouteId',
        timestamp: expect.any(Date),
        current_position: {
          latitude: 59.3293,
          longitude: 18.0686,
        },
        congestion_level: {
          timestamp: expect.any(Date),
          level: 0,
          previousStop: null,
          currentStop: null,
        },
      });

      // Check if the returned result is an instance of VehiclePositions
      expect(result).toBeInstanceOf(VehiclePositions);
    });



      it('should update the existing vehicle position and congestion level', async () => {
        // Mock data
        const vehicle = {
          vehicle: {
            timestamp: new Date(),
            position: {
              latitude: 1.234,
              longitude: 5.678,
              speed: 50, // Replace with actual speed value
              bearing: 90, // Replace with actual bearing value
            },
          },
        };
        const existingPosition = {
          timestamp: new Date(),
          current_position: {
            latitude: 0,
            longitude: 0,
          },
          congestion_level: {
            timestamp: new Date(),
            level: 0,
            previousStop: null,
            currentStop: null,
          },
        };
        const existingTrip = {
          _id: 'existingTripId',
        };

        // Mock the congestionLevelStockholm function
        congestionLevelStockholm.mockResolvedValue({
          congestionLevel: 1,
          nextStop: 'nextStopId',
          currentStop: 'currentStopId',
        });

        // Call the updateVehicle method
        await processor.updateVehicle(vehicle, existingPosition, existingTrip);

        // Assertions
        expect(existingPosition.timestamp).toBe(vehicle.vehicle.timestamp);
        expect(existingPosition.current_position.latitude).toBe(1.234);
        expect(existingPosition.current_position.longitude).toBe(5.678);

        // Check if congestionLevelStockholm has been called with the expected arguments
        expect(congestionLevelStockholm).toHaveBeenCalledWith(
          'existingTripId',
          50, // Replace with actual speed value
          1.234, // Replace with actual latitude value
          5.678, // Replace with actual longitude value
          90 // Replace with actual bearing value
        );

        // Check if congestion level and stops are updated
        expect(existingPosition.congestion_level.timestamp).toBeInstanceOf(Date);
        expect(existingPosition.congestion_level.level).toBe(1);
        expect(existingPosition.congestion_level.currentStop).toBe('nextStopId');
        expect(existingPosition.congestion_level.previousStop).toBe('currentStopId');
      });


      it('should create a new TripUpdate instance', () => {
        // Mock data
        const tripUpdate = {
          tripUpdate: {
            trip: {
              tripId: 'someTripId',
            },
            stopTimeUpdate: ['stopTimeUpdate1', 'stopTimeUpdate2'],
          },
        };
        const city = 'Stockholm';

        // Call the createNewTripUpdate method
        const result = processor.createNewTripUpdate(tripUpdate, city);

        // Assertions
        expect(TripUpdate).toHaveBeenCalledWith({
          city: 'Stockholm',
          trip_id: 'someTripId',
          stopTimeUpdates: ['stopTimeUpdate1', 'stopTimeUpdate2'],
        });

        // Check if the returned result is an instance of TripUpdate
        expect(result).toBeInstanceOf(TripUpdate);
      });

      it('should update the existing TripUpdate', () => {
        // Mock data
        const existingTripUpdate = {
          stopTimeUpdates: ['existingStopTimeUpdate'],
        };

        const tripUpdate = {
          tripUpdate: {
            stopTimeUpdate: ['newStopTimeUpdate1', 'newStopTimeUpdate2'],
          },
        };

        // Call the updateTrip method
        processor.updateTrip(existingTripUpdate, tripUpdate);

        // Assertions
        expect(existingTripUpdate.stopTimeUpdates).toEqual(['newStopTimeUpdate1', 'newStopTimeUpdate2']);
      });

});
