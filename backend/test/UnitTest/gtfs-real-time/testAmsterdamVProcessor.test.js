
import { TripUpdate } from "../../../src/DBmodels/tripUpdate.js";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import {AmsterdamVehicleDataProcessor} from "../../../src/gtfs-realtime/AmsterdamVehicleDataProcessor.js";
import {congestionLevel} from "../../../src/utils/congestionLevel.js";
import {Route} from "../../../src/DBmodels/busline.js";
import { VehiclePositions } from "../../../src/DBmodels/vehiclepositions.js";

jest.mock("../../../src/DBmodels/tripUpdate.js")
jest.mock("../../../src/utils/congestionLevel.js");
jest.mock("../../../src/DBmodels/vehiclepositions.js");
jest.mock("../../../src/DBmodels/busline.js", () => ({
  Route: {
    findOne: jest.fn(),
  },
}));



describe('AmsterdamVehicleDataProcessor', () => {
  let dataProcessor;

  beforeEach(() => {
    dataProcessor = new AmsterdamVehicleDataProcessor();
    jest.clearAllMocks();
  });

  it('should update trip with new stop time updates', () => {
    // Arrange: Create mock objects for existingTripUpdate and tripUpdate
    const existingTripUpdate = new TripUpdate({
      city: "Amsterdam",
      trip_id: "123",
      stopTimeUpdates: [{ stopSequence: 1, time: new Date() }]
    });

    const newStopTimeUpdates = [{ stopSequence: 2, time: new Date() }];

    const tripUpdate = {
      tripUpdate: {
        trip: { tripId: "123" },
        stopTimeUpdate: newStopTimeUpdates
      }
    };

    // Act: Call updateTrip method
    dataProcessor.updateTrip(existingTripUpdate, tripUpdate);

    // Assert: Verify that existingTripUpdate's stopTimeUpdates have been updated
    expect(existingTripUpdate.stopTimeUpdates).toEqual(newStopTimeUpdates);
  });


it('should create new trip update with stop time updates', () => {
  TripUpdate.mockImplementation((data) => data);
    // Arrange: Create mock objects for tripUpdate
    const tripUpdate = {
      tripUpdate: {
        trip: { tripId: "123" },
        stopTimeUpdate: [{ stopSequence: 1, time: new Date() }]
      }
    };

    // Act: Call createNewTripUpdate method
    const newTripUpdate = dataProcessor.createNewTripUpdate(tripUpdate, "Amsterdam");

    // Assert: Verify that newTripUpdate has been created with the correct stopTimeUpdates
    expect(newTripUpdate.stopTimeUpdates).toEqual(tripUpdate.tripUpdate.stopTimeUpdate);
  });

  it('should update vehicle with new position and congestion level', async () => {
    // Arrange: Create mock objects for vehicle, existingPosition, and existingTrip
    const vehicle = {
      vehicle: {
        position: { latitude: 52.0, longitude: 5.0 },
        timestamp: new Date(),
        currentStopSequence: 2,
        current_status: 'IN_TRANSIT_TO',
        stopId: 'stop123'
      }
    };
    const existingPosition = {
      previous_position: { latitude: null, longitude: null },
      current_position: { latitude: 51.0, longitude: 4.0 },
      timestamp: new Date('2023-01-01T00:00:00Z'),
      congestion_level: {},
      current_stop_sequence: 1,
      current_status: 'STOPPED_AT',
      stop_id: 'stop123'
    };
    const existingTrip = {
      trip_id: 'trip123',
      route_id: 'route123'
    };

    // Set up Route.findOne mock to return a route
    Route.findOne.mockResolvedValue({ _id: 'route123', route_id: 'route123' });

    // Set up congestionLevel mock to return congestion data
    const mockCongestion = {
      congestionLevel: 3,
      previousStop: 'prevStop',
      currentStop: 'currStop'
    };
    congestionLevel.mockResolvedValue(mockCongestion);

    // Act: Call updateVehicle method
    await dataProcessor.updateVehicle(vehicle, existingPosition, existingTrip);

    // Assert: Verify that existingPosition is updated correctly
    expect(existingPosition.previous_position).toEqual({
      latitude: 51.0,
      longitude: 4.0
    });
    expect(existingPosition.current_position).toEqual({
      latitude: 52.0,
      longitude: 5.0
    });
    expect(existingPosition.congestion_level).toEqual({
      timestamp: expect.any(Date),
      level: mockCongestion.congestionLevel,
      previousStop: mockCongestion.previousStop,
      currentStop: mockCongestion.currentStop
    });
    expect(existingPosition.current_stop_sequence).toBe(vehicle.vehicle.currentStopSequence);
    expect(existingPosition.current_status).toBe(vehicle.vehicle.current_status);
    expect(existingPosition.stop_id).toBe(vehicle.vehicle.stopId);

    // Verify that Route.findOne and congestionLevel were called with correct parameters
    expect(Route.findOne).toHaveBeenCalledWith({ _id: existingTrip.route_id });
    expect(congestionLevel).toHaveBeenCalledWith(existingTrip.route_id, expect.any(Object));
  });

  it('should create a new VehiclePositions instance with correct data', () => {
    // Arrange: Create mock objects for vehicle, existingTrip, route, and city
    VehiclePositions.mockImplementation((data) => data);


    const vehicle = {
      vehicle: {
        position: { latitude: 52.0, longitude: 5.0 },
        timestamp: new Date('2023-01-01T00:00:00Z'),
        stopId: 'stop123',
        currentStopSequence: 1,
        currentStatus: 'IN_TRANSIT_TO',
      }
    };

    const existingTrip = { _id: 'trip123' };
    const route = { _id: 'route123' };
    const city = 'Amsterdam';

    // Act: Call createNewVehicle method
    const newVehiclePosition = dataProcessor.createNewVehicle(vehicle, existingTrip, route, city);

    // Assert: Verify that the new VehiclePositions object has the correct data
    expect(VehiclePositions).toHaveBeenCalledWith({
      city: city,
      currentTrip_id: existingTrip._id,
      route: route._id,
      timestamp: vehicle.vehicle.timestamp,
      current_position: {
        latitude: vehicle.vehicle.position.latitude,
        longitude: vehicle.vehicle.position.longitude
      },
      previous_position: {
        latitude: null,
        longitude: null
      },
      stop_id: vehicle.vehicle.stopId,
      current_stop_sequence: vehicle.vehicle.currentStopSequence,
      current_status: vehicle.vehicle.currentStatus,
      congestion_level: {
        timestamp: expect.any(Date),
        level: 0,
        previousStop: null,
        currentStop: null
      }
    });


    expect(newVehiclePosition).toMatchObject({
      city: city,
      currentTrip_id: existingTrip._id,
      route: route._id,

    });
  });



});
