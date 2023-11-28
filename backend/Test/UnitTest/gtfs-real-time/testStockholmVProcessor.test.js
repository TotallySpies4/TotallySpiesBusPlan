import { StockholmVehicleDataProcessor } from '../../../src/gtfs-realtime/StockholmVehicleDataProcessor';
import { IVehicleDataProcessor } from '../../../src/gtfs-realtime/IVehicleDataProcessor';
import { VehiclePositions } from '../../../src/DBmodels/vehiclepositions.js';
import { TripUpdate } from '../../../src/DBmodels/tripUpdate.js';
import { congestionLevelStockholm } from '../../../src/utils/congestionLevel';

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

  describe('createNewVehicle', () => {
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
  });

  describe('updateVehicle', () => {
    it('should update the existing VehiclePositions instance', async () => {
      const vehicle = {
        vehicle: {
          timestamp: new Date(),
          position: {
            latitude: 59.3293,
            longitude: 18.0686,
            speed: 30,
            bearing: 45,
          },
        },
      };
      const existingPosition = {
        timestamp: new Date(),
        current_position: {
          latitude: 59.3293,
          longitude: 18.0686,
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
        trip_id: 'existingTripId',
      };

      // Mock the congestionLevelStockholm function
      congestionLevelStockholm.mockResolvedValue({
        congestionLevel: 1,
        currentStop: 'CurrentStop',
        nextStop: 'NextStop',
      });

      await processor.updateVehicle(vehicle, existingPosition, existingTrip);

      // Check if the existingPosition object was updated correctly
      expect(existingPosition.timestamp).toEqual(expect.any(Date));
      expect(existingPosition.current_position.latitude).toBeCloseTo(59.3293);
      expect(existingPosition.current_position.longitude).toBeCloseTo(18.0686);
      expect(existingPosition.congestion_level.timestamp).toEqual(expect.any(Date));
      expect(existingPosition.congestion_level.level).toBe(1);
      expect(existingPosition.congestion_level.currentStop).toBe('NextStop');
      expect(existingPosition.congestion_level.previousStop).toBe('CurrentStop');
    });
  });
});
