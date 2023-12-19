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
        test('should update the existing vehicle position and congestion level', async () => {
          const vehicle = {
            vehicle: {
              position: {
                latitude: 52.12345,
                longitude: 4.56789,
              },
              timestamp: new Date(),
              currentStopSequence: 2,
              currentStatus: 'STOPPED_AT',
            },
          };

          const existingPosition = {
            current_position: {
              latitude: 52.98765,
              longitude: 4.32109,
            },
          };

          const route = {
            route_id: 'your_route_id',
            route_short_name: 'Route 1',
            route_long_name: 'Route 1 Long Name',
          };

          const mockCongestion = {
            congestionLevel: 3,
            previousStop: 'previous_stop_id',
            currentStop: 'current_stop_id',
          };

          congestionLevel.mockResolvedValue(mockCongestion); // Mock the congestionLevel function to return the mockCongestion object

          await processor.updateVehicle(vehicle, existingPosition, route);

          expect(existingPosition.congestion_level.timestamp).toEqual(expect.any(Date));
          expect(existingPosition.congestion_level.level).toEqual(mockCongestion.congestionLevel);
          expect(existingPosition.congestion_level.previousStop).toEqual(mockCongestion.previousStop);
          expect(existingPosition.congestion_level.currentStop).toEqual(mockCongestion.currentStop);
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
