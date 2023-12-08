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
        it('should update the existing vehicle position and congestion level', async () => {
          // Mock data
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
          const existingPosition = {
            current_position: {
              latitude: 0,
              longitude: 0,
            },
            previous_position: {
              latitude: 0,
              longitude: 0,
            },
            timestamp: new Date(),
            stop_id: 'someStopId',
            current_stop_sequence: 42,
            current_status: 'someStatus',
            congestion_level: {
              timestamp: new Date(),
              level: 0,
              previousStop: null,
              currentStop: null,
            },
          };
          const existingTrip = {
            route_id: 'existingRouteId',
            trip_id: 'existingTripId',
          };

          // Mock the congestionLevel function
          congestionLevel.mockResolvedValue({
            timestamp: new Date(),
            congestionLevel: 1,
            previousStop: 'previousStopId',
            currentStop: 'currentStopId',
          });

          // Mock the Route.findOne function
          Route.findOne.mockResolvedValue({
            route_id: 'existingRouteId',
          });

          // Call the updateVehicle method
          await processor.updateVehicle(vehicle, existingPosition, existingTrip);

          // Assertions
          expect(existingPosition.timestamp).toBe(vehicle.vehicle.timestamp);
          expect(existingPosition.current_position.latitude).toBe(1.234);
          expect(existingPosition.current_position.longitude).toBe(5.678);
          expect(existingPosition.previous_position.latitude).toBe(0);
          expect(existingPosition.previous_position.longitude).toBe(0);

          // Check if congestionLevel has been called with the expected arguments
          expect(congestionLevel).toHaveBeenCalledWith('existingRouteId', {
            trip_id: 'existingTripId',
            stopSequence: 42,
            positions: ([
              {
                position: { latitude: 0, longitude: 0 },
                timestamp: existingPosition.timestamp,
              },
              {
                position: vehicle.vehicle.position,
                timestamp: vehicle.vehicle.timestamp,
              },
            ]),
          });

          // Check if congestion level and stops are updated
            expect(existingPosition.congestion_level.timestamp).toBeInstanceOf(Date);
          expect(existingPosition.congestion_level.level).toBe(1);
          expect(existingPosition.congestion_level.currentStop).toBe('currentStopId');
          expect(existingPosition.congestion_level.previousStop).toBe('previousStopId');
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
