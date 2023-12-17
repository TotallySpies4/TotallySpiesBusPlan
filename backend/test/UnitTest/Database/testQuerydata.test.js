import {
  getBusAllBuslineAmsterdam,
  getBusAllBuslineStockholm,
  getBusDetails,
  fetchAverageSpeed,
} from "../../../src/queryData/queryDbData.js";
import { Route, StopTime, Trip } from "../../../src/DBmodels/busline.js";
import { TripUpdate } from "../../../src/DBmodels/tripUpdate.js";
import { SegmentSpeedPrediction } from "../../../src/DBmodels/segmentSpeedPrediction.js";
import { VehiclePositions } from "../../../src/DBmodels/vehiclepositions.js";
import { calculatorScheduledSpeedAmsterdam, calculatorScheduledSpeedStockholm } from "../../../src/utils/speedCalculator.js";
import { getShapesBetweenStops } from "../../../src/utils/shapesUtilSet.js";
import { agency } from "../../../src/utils/enum.js";
import { populate } from 'mongoose';
import {describe, expect, it, jest} from "@jest/globals";

// Mock the necessary dependencies
jest.mock("../../../src/DBmodels/busline.js");
jest.mock("../../../src/DBmodels/vehiclepositions.js");
jest.mock("../../../src/utils/speedCalculator.js");
jest.mock("../../../src/utils/shapesUtilSet.js");
jest.mock("../../../src/DBmodels/tripUpdate.js");
jest.mock("../../../src/DBmodels/segmentSpeedPrediction.js");

describe('Busline Service', () => {
  describe('getBusAllBuslineAmsterdam', () => {
    it('should retrieve all bus lines from Amsterdam', async () => {
      // Mock the Route.find() method to return a dummy response
      Route.find.mockResolvedValue(['busLine1', 'busLine2']);

      // Call the function being tested
      const result = await getBusAllBuslineAmsterdam();

      // Check the expected result
      expect(result).toEqual(['busLine1', 'busLine2']);

      // Verify that the Route.find() method was called
      expect(Route.find).toHaveBeenCalledWith({ agency_id: agency.GVB });
    });
  });

  describe('getBusAllBuslineStockholm', () => {
    it('should retrieve all bus lines from Stockholm', async () => {
      // Mock the Route.find() method to return a dummy response
      Route.find.mockResolvedValue(['busLine1', 'busLine2']);

      // Call the function being tested
      const result = await getBusAllBuslineStockholm();

      // Check the expected result
      expect(result).toEqual(['busLine1', 'busLine2']);

      // Verify that the Route.find() method was called
      expect(Route.find).toHaveBeenCalledWith({ agency_id: agency.SL });
    });
  });

  describe('getBusDetails', () => {
      it('should retrieve bus details for a given routeID', async () => {
        // Mock the necessary dependencies and their responses
        const route = {
          _id: 'routeId',
          trips: ['tripId1', 'tripId2'],
        };
        const currentVehicle = {
          currentTrip_id: 'currentTripId',
          congestion_level: {
            previousStop: 'previousStop',
            currentStop: 'currentStop',
          },
        };
        const trip = {
          _id: 'tripId',
          shapes: ['shape1', 'shape2'],
        };
        const tripUpdate = {
          stopTimeUpdates: ['update1', 'update2'],
        };
        const segmentSpeedPrediction = ['prediction1', 'prediction2'];

        // Mock the necessary methods from the models
        const populate = jest.fn().mockResolvedValueOnce(currentVehicle);
        Route.findOne.mockReturnValue({ populate: populate.mockReturnValueOnce({}) });
        VehiclePositions.findOne.mockResolvedValue(currentVehicle);
        Trip.findOne.mockResolvedValue({ toObject: jest.fn().mockReturnValue(trip) });
        TripUpdate.findOne.mockResolvedValue(tripUpdate);
        SegmentSpeedPrediction.find.mockResolvedValue(segmentSpeedPrediction);

        // Call the function being tested
        const result = await getBusDetails('routeId');

        // Check the expected result
        expect(result).toEqual({
          currentVehicle,
          trip,
          congestionShape: ['shape1', 'shape2'],
          updateStoptime: tripUpdate.stopTimeUpdates,
          segmentSpeedPrediction,
        });

        // Verify that the necessary methods were called
        expect(Route.findOne).toHaveBeenCalledWith({ route_id: 'routeId' });
        expect(VehiclePositions.findOne).toHaveBeenCalledWith({ route: 'routeId' });
        expect(Trip.findOne).toHaveBeenCalledWith({ _id: 'currentTripId' });
        expect(TripUpdate.findOne).toHaveBeenCalledWith({ trip_id: 'tripId' });
        expect(SegmentSpeedPrediction.find).toHaveBeenCalledWith({ trip_id: 'tripId' });
        expect(populate).toHaveBeenCalledWith('currentTrip_id', 'congestion_level.previousStop', 'congestion_level.currentStop');
      });
    });


  describe('fetchAverageSpeed', () => {
    it('should fetch the average speed for a given route and direction', async () => {
      // Mock the necessary dependencies and their responses
      const routeId = 'routeId';
      const direction = 'direction';
      const startTime = new Date('2023-12-15T10:00:00Z');
      const endTime = new Date('2023-12-15T11:00:00Z');
      const segmentSpeedPredictions = [
        { speed: 30 },
        { speed: 40 },
        { speed: 35 },
        { speed: 45 },
      ];

      // Mock the necessary methods from the models
      SegmentSpeedPrediction.find.mockResolvedValue(segmentSpeedPredictions);

      // Call the function being tested
      const result = await fetchAverageSpeed(routeId, direction, startTime, endTime);

      // Calculate the expected average speed
      const totalSpeed = segmentSpeedPredictions.reduce((sum, prediction) => sum + prediction.speed, 0);
      const averageSpeed = totalSpeed / segmentSpeedPredictions.length;

      // Check the expected result
      expect(result).toBe(averageSpeed);

      // Verify that the necessary methods were called
      expect(SegmentSpeedPrediction.find).toHaveBeenCalledWith({
        route_id: routeId,
        direction,
        startTime: { $gte: startTime },
        endTime: { $lte: endTime },
      });
    });

    it('should fetch the average speed for a given routeID, tripID, and stop sequence (Stockholm)', async () => {
      // Mock the necessary dependencies and their responses
      const route = {
        trips: [
          { trip_id: 'tripId1', stop_times: ['stopTimeId11', 'stopTimeId12'] },
          { trip_id: 'tripId2', stop_times: ['stopTimeId21', 'stopTimeId22'] },
        ],
      };
      const currentStopTime = {
        _id: 'stopTimeId12',
        arrival_time: '12:00:00',
        departure_time: '12:05:00',
      };
      const previousStopTime = {
        _id: 'stopTimeId11',
        arrival_time: '11:50:00',
        departure_time: '11:55:00',
      };
      const speed = 50;

      Route.findOne.mockReturnValue({ populate: populate.mockReturnValueOnce({}) });
      StopTime.findOne.mockResolvedValueOnce(currentStopTime).mockResolvedValueOnce(previousStopTime);
      calculatorScheduledSpeedStockholm.mockReturnValue(speed);

      // Call the function being tested
      const result = await fetchAverageSpeed('routeId', 'tripId', 2);

      // Check the expected result
      expect(result).toEqual(speed);

      // Verify that the necessary methods were called
      expect(Route.findOne).toHaveBeenCalledWith({ route_id: 'routeId' });
      expect(StopTime.findOne).toHaveBeenNthCalledWith(1, { trip_id: 'tripId', stop_sequence: 2 });
      expect(StopTime.findOne).toHaveBeenNthCalledWith(2, { trip_id: 'tripId', stop_sequence: 1 });
      expect(calculatorScheduledSpeedStockholm).toHaveBeenCalledWith(
        currentStopTime.arrival_time,
        currentStopTime.departure_time,
        previousStopTime.arrival_time,
        previousStopTime.departure_time
      );
    });
  });

  describe('getShapesBetweenStops', () => {
      it('should retrieve the shapes between two stops', async () => {
        // Mock the necessary dependencies and their responses
        const route = {
          _id: 'routeId',
          trips: ['tripId1', 'tripId2'],
          populate: jest.fn().mockResolvedValueOnce(route),
        };
        Route.findOne.mockResolvedValue(route);
        Trip.findOne.mockResolvedValue({ toObject: jest.fn().mockReturnValue(route) });
        getShapesBetweenStops.mockResolvedValue(['shape1', 'shape2']);

        // Call the function being tested
        const result = await getShapesBetweenStops(route, 'stopId1', 'stopId2');

        // Check the expected result
        expect(result).toEqual(['shape1', 'shape2']);

        // Verify that the necessary methods were called
        expect(Route.findOne).toHaveBeenCalledWith({ route_id: 'routeId' });
        expect(getShapesBetweenStops).toHaveBeenCalledWith(route, 'stopId1', 'stopId2');
      });
    });
  });