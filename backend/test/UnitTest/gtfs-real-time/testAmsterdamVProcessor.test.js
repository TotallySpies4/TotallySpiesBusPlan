import { AmsterdamVehicleDataProcessor } from '../../../src/gtfs-realtime/AmsterdamVehicleDataProcessor.js';
import { IVehicleDataProcessor } from '../../../src/gtfs-realtime/IVehicleDataProcessor';
import { VehiclePositions } from '../../../src/DBmodels/vehiclepositions.js';
import { Route } from '../../../src/DBmodels/busline.js';
import { TripUpdate } from '../../../src/DBmodels/tripUpdate.js';
import { congestionLevel } from "../../../src/utils/congestionLevel";

// Mocking dependencies
jest.mock('../../../src/DBmodels/vehiclepositions.js');
jest.mock('../../../src/DBmodels/busline.js');
jest.mock('../../../src/DBmodels/tripUpdate.js');
jest.mock('../../../src/utils/congestionLevel');

describe('AmsterdamVehicleDataProcessor', () => {
  let processor;

  beforeEach(() => {
    // Reset mocks and create a new instance of the processor for each test
    jest.clearAllMocks();
    processor = new AmsterdamVehicleDataProcessor();
  });

  describe('createNewVehicle', () => {
    it('should create a new VehiclePositions instance', () => {
      const vehicle = {
        vehicle: {
          timestamp: new Date(),
          position: {
            latitude: 1.234,
            longitude: 5.678,
          },
          stopId: 'someStopId',
          currentStopSequence: 42,
          currentStatus: 'someStatus',
        },
      };
      const existingTrip = {
        _id: 'existingTripId',
        route_id: 'existingRouteId',
        trip_id: 'existingTripId',
      };
      const route = {
        _id: 'existingRouteId',
      };
      const city = 'Amsterdam';

      const result = processor.createNewVehicle(vehicle, existingTrip, route, city);

      // Check if the constructor was called with the expected arguments
      expect(VehiclePositions).toHaveBeenCalledWith({
        city: 'Amsterdam',
        currentTrip_id: 'existingTripId',
        route: 'existingRouteId',
        timestamp: expect.any(Date),
        current_position: {
          latitude: 1.234,
          longitude: 5.678,
        },
        previous_position: {
          latitude: null,
          longitude: null,
        },
        stop_id: 'someStopId',
        current_stop_sequence: 42,
        current_status: 'someStatus',
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
  });

    describe('updateVehicle', () => {
        it('should update the existing vehicle position and congestion level', () => {
          // Mock the necessary functions
          const congestionLevel = jest.fn();
          const findOneMock = jest.spyOn(Route, 'findOne').mockResolvedValue({ _id: 'existingRouteId' });

          // Define the expected values
          const expectedPositions = [
            {
              position: {
                latitude: 1.234,
                longitude: 5.678,
              },
              timestamp: new Date('2023-12-12T19:20:24.975Z'),
            },
            // Add more positions if needed
          ];

          // Call the function that updates the vehicle
          updateVehicle('vehicleId', expectedPositions);

          // Verify the function calls
          expect(congestionLevel).toHaveBeenCalledWith('existingRouteId', { positions: expectedPositions });
          expect(findOneMock).toHaveBeenCalledWith({ vehicleId: 'vehicleId' });

          // Restore the original implementation of the mocked function
          findOneMock.mockRestore();
        });
      });

      describe('createNewTripUpdate', () => {
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
            const city = 'Amsterdam';

            // Call the createNewTripUpdate method
            const result = processor.createNewTripUpdate(tripUpdate, city);

            // Assertions
            expect(TripUpdate).toHaveBeenCalledWith({
              city: 'Amsterdam',
              trip_id: 'someTripId',
              stopTimeUpdates: ['stopTimeUpdate1', 'stopTimeUpdate2'],
            });

            // Check if the returned result is an instance of TripUpdate
            expect(result).toBeInstanceOf(TripUpdate);
          });
        });

      describe('updateTrip', () => {
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
});
