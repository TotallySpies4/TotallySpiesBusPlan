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
const mongoose = require('mongoose');

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
      it('should retrieve bus details for a given route ID', async () => {
        // Set up the test data
        const routeID = 'routeId';
        const route = {
          _id: 'routeId',
          trips: ['tripId1', 'tripId2'],
        };

        // Mock the implementation of findOne and populate
        Route.findOne.mockResolvedValue(route);
        Route.findOne.populate = jest.fn().mockResolvedValue(route);

        const result = await getBusDetails(routeID);
        expect(result).toBeDefined();
        expect(Route.findOne).toHaveBeenCalledWith({ route_id: routeID });
        expect(Route.findOne.populate).toHaveBeenCalledWith(route, 'trips');
      });

      it('should throw an error when route is not found', async () => {
        // Arrange
        const routeID = 'nonexistentRoute';
        Route.findOne.mockResolvedValue(null);

        // Act and Assert
        await expect(getBusDetails(routeID)).rejects.toThrowError();
      });
    });

  describe('fetchAverageSpeed', () => {
      it('should calculate the average speed correctly for a given routeId', async () => {
        const routeId = 'routeId';
        const stopTimeId11 = 'stopTimeId11';
        const stopTimeId12 = 'stopTimeId12';
        const stopTimeId21 = 'stopTimeId21';
        const stopTimeId22 = 'stopTimeId22';

        const route = {
          _id: routeId,
          trips: [
            { trip_id: 'tripId1', stop_times: [stopTimeId11, stopTimeId12] },
            { trip_id: 'tripId2', stop_times: [stopTimeId21, stopTimeId22] },
          ],
        };

        const stopTime1 = { _id: stopTimeId11 };
        const stopTime2 = { _id: stopTimeId12 };
        const stopTime3 = { _id: stopTimeId21 };
        const stopTime4 = { _id: stopTimeId22 };

        // Mock the necessary dependencies
        Route.findOne.mockResolvedValue(route);
        stopTimeRepository.findById.mockResolvedValueOnce(stopTime1)
          .mockResolvedValueOnce(stopTime2)
          .mockResolvedValueOnce(stopTime3)
          .mockResolvedValueOnce(stopTime4);
        calculatorScheduledSpeed.mockReturnValueOnce(10).mockReturnValueOnce(15);

        const averageSpeed = await fetchAverageSpeed(routeId);

        expect(Route.findOne).toHaveBeenCalledWith({ _id: routeId });
        expect(stopTimeRepository.findById).toHaveBeenNthCalledWith(1, stopTimeId11);
        expect(stopTimeRepository.findById).toHaveBeenNthCalledWith(2, stopTimeId12);
        expect(stopTimeRepository.findById).toHaveBeenNthCalledWith(3, stopTimeId21);
        expect(stopTimeRepository.findById).toHaveBeenNthCalledWith(4, stopTimeId22);
        expect(calculatorScheduledSpeed).toHaveBeenCalledWith([stopTime1, stopTime2]);
        expect(calculatorScheduledSpeed).toHaveBeenCalledWith([stopTime3, stopTime4]);
        expect(averageSpeed).toBe(12.5);
      });

    it('should calculate the average speed correctly for Amsterdam', async () => {
        const routeId = 'routeId';
        const stopTimeId11 = 'stopTimeId11';
        const stopTimeId12 = 'stopTimeId12';
        const stopTimeId21 = 'stopTimeId21';
        const stopTimeId22 = 'stopTimeId22';

        const route = {
          _id: routeId,
          trips: [
            { trip_id: 'tripId1', stop_times: [stopTimeId11, stopTimeId12] },
            { trip_id: 'tripId2', stop_times: [stopTimeId21, stopTimeId22] },
          ],
        };

        const stopTime1 = { _id: stopTimeId11 };
        const stopTime2 = { _id: stopTimeId12 };
        const stopTime3 = { _id: stopTimeId21 };
        const stopTime4 = { _id: stopTimeId22 };

        const calculatorScheduledSpeedAmsterdam = jest.fn().mockReturnValue(10);

        Route.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(route),
              });
        StopTime.findOne
          .mockReturnValueOnce(stopTime1)
          .mockReturnValueOnce(stopTime2)
          .mockReturnValueOnce(stopTime3)
          .mockReturnValueOnce(stopTime4);

        const averageSpeed = await fetchAverageSpeed(routeId, 'Amsterdam');

        expect(Route.findOne).toHaveBeenCalledWith({ _id: routeId });
        expect(StopTime.findOne).toHaveBeenNthCalledWith(1, { _id: stopTimeId11 });
        expect(StopTime.findOne).toHaveBeenNthCalledWith(2, { _id: stopTimeId12 });
        expect(StopTime.findOne).toHaveBeenNthCalledWith(3, { _id: stopTimeId21 });
        expect(StopTime.findOne).toHaveBeenNthCalledWith(4, { _id: stopTimeId22 });
        expect(calculatorScheduledSpeedAmsterdam).toHaveBeenCalledWith([stopTime1, stopTime2]);
        expect(calculatorScheduledSpeedAmsterdam).toHaveBeenCalledWith([stopTime3, stopTime4]);
        expect(averageSpeed).toBe(10);
      });

      it('should calculate the average speed correctly for Stockholm', async () => {
        const routeId = 'routeId';
        const stopTimeId11 = 'stopTimeId11';
        const stopTimeId12 = 'stopTimeId12';
        const stopTimeId21 = 'stopTimeId21';
        const stopTimeId22 = 'stopTimeId22';

        const route = {
          _id: routeId,
          trips: [
            { trip_id: 'tripId1', stop_times: [stopTimeId11, stopTimeId12] },
            { trip_id: 'tripId2', stop_times: [stopTimeId21, stopTimeId22] },
          ],
        };

        const stopTime1 = { _id: stopTimeId11 };
        const stopTime2 = { _id: stopTimeId12 };
        const stopTime3 = { _id: stopTimeId21 };
        const stopTime4 = { _id: stopTimeId22 };

        const calculatorScheduledSpeedStockholm = jest.fn().mockReturnValue(15);

        Route.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(route),
              });
        StopTime.findOne
          .mockReturnValueOnce(stopTime1)
          .mockReturnValueOnce(stopTime2)
          .mockReturnValueOnce(stopTime3)
          .mockReturnValueOnce(stopTime4);

        const averageSpeed = await fetchAverageSpeed(routeId, 'Stockholm');

        expect(Route.findOne).toHaveBeenCalledWith({ _id: routeId });
        expect(StopTime.findOne).toHaveBeenNthCalledWith(1, { _id: stopTimeId11 });
        expect(StopTime.findOne).toHaveBeenNthCalledWith(2, { _id: stopTimeId12 });
        expect(StopTime.findOne).toHaveBeenNthCalledWith(3, { _id: stopTimeId21 });
        expect(StopTime.findOne).toHaveBeenNthCalledWith(4, { _id: stopTimeId22 });
        expect(calculatorScheduledSpeedStockholm).toHaveBeenCalledWith([stopTime1, stopTime2]);
        expect(calculatorScheduledSpeedStockholm).toHaveBeenCalledWith([stopTime3, stopTime4]);
        expect(averageSpeed).toBe(15);
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