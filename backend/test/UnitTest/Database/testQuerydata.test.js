import * as queryDbData from "../../../src/queryData/queryDbData.js";
import {handleInactivity} from "../../../src//utils/querydataUtil.js";
import { Route, StopTime, Trip } from "../../../src/DBmodels/busline.js";
import { TripUpdate } from "../../../src/DBmodels/tripUpdate.js";
import { SegmentSpeedPrediction } from "../../../src/DBmodels/segmentSpeedPrediction.js";
import { VehiclePositions } from "../../../src/DBmodels/vehiclepositions.js";
import { calculatorScheduledSpeedAmsterdam, calculatorScheduledSpeedStockholm } from "../../../src/utils/speedCalculator.js";
import { getShapesBetweenStops } from "../../../src/utils/shapesUtilSet.js";
import { agency } from "../../../src/utils/enum.js";
import {beforeEach, describe, expect, it, jest} from "@jest/globals";
const mongoose = require('mongoose');

// Mock the necessary dependencies
jest.mock("../../../src/DBmodels/busline.js");
jest.mock("../../../src/DBmodels/vehiclepositions.js");
jest.mock("../../../src/utils/speedCalculator.js");
jest.mock("../../../src/utils/shapesUtilSet.js");
jest.mock("../../../src/DBmodels/tripUpdate.js");
jest.mock("../../../src/DBmodels/segmentSpeedPrediction.js");
jest.mock("../../../src/utils/querydataUtil");


describe('Busline Service', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe('getBusAllBuslineAmsterdam', () => {
    it('should retrieve all bus lines from Amsterdam', async () => {
      // Mock the Route.find() method to return a dummy response
      Route.find.mockResolvedValue(['busLine1', 'busLine2']);

      // Call the function being tested
      const result = await queryDbData.getBusAllBuslineAmsterdam();

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
      const result = await queryDbData.getBusAllBuslineStockholm();

      // Check the expected result
      expect(result).toEqual(['busLine1', 'busLine2']);

      // Verify that the Route.find() method was called
      expect(Route.find).toHaveBeenCalledWith({ agency_id: agency.SL });
    });
  });




  describe('getBusDetails', () => {
      it('should retrieve bus details for a given route ID', async () => {
          const mockRoute = {
              agency_id: 'GVB',
              route_id: 'route123',
              route_short_name: 'ShortName',
              route_long_name: 'LongName',
              trips: ['tripObjectId1', 'tripObjectId2']
          };

          const mockCurrentVehicle = {
              city: 'Amsterdam',
              currentTrip_id: 'tripObjectId1',
              route: 'routeObjectId',
              timestamp: 'timestampString',
              current_position: { latitude: 52.3676, longitude: 4.9041 },
              previous_position: { latitude: 52.3667, longitude: 4.9052 },
              stop_id: 'stopId123',
              current_stop_sequence: 3,
              current_status: 'statusString',
              congestion_level: {
                  timestamp: new Date(),
                  level: 2,
                  previousStop: 'previousStopId',
                  currentStop: 'currentStopId',
              }
          };

          const mockTrip = {
              agency_id: 'GVB',
              trip_id: 'trip123',
              route_id: 'route123',
              stop_times: ['stopTimeObjectId1', 'stopTimeObjectId2'],
              shapes: ['shapeObjectId1', 'shapeObjectId2']
          };
          const mockSegmentSpeedPrediction = [{
              trip_id: 'trip123',
              previous_stop_id: 'prevStopId',
              next_stop_id: 'nextStopId',
              segment_number: 1,
              average_speed: 50,
              speed_30_min_prediction: { speed: 45, level: 2 },
              speed_60_min_prediction: { speed: 40, level: 3 },
              shapes: ['shapeObjectId3', 'shapeObjectId4']
          }];

          Route.findOne.mockImplementation(() => ({
              populate: jest.fn().mockResolvedValue(mockRoute)
          }));
          VehiclePositions.findOne.mockResolvedValue(mockCurrentVehicle);
          Trip.findOne.mockImplementation(() => ({
              populate: jest.fn().mockImplementation(() => ({
                  populate: jest.fn().mockResolvedValue(mockTrip)
              }))
          }));
          SegmentSpeedPrediction.find.mockImplementation(() => ({
              sort: jest.fn().mockReturnThis(), // Mock sort to return the same object (this)
              populate: jest.fn().mockResolvedValue(mockSegmentSpeedPrediction)
          }));

          const result = await queryDbData.getBusDetails('route123');

          expect(result).toHaveProperty('currentVehicle');
          expect(result.currentVehicle).not.toBeNull();
          expect(result.currentVehicle).toEqual(mockCurrentVehicle);
          // Add more assertions as needed
      });

      it('should handle the scenario where currentVehicle is null', async () => {
          // Mock Route with a valid response
          const mockRoute = {
              agency_id: 'GVB',
              route_id: 'route123',
              route_short_name: 'ShortName',
              route_long_name: 'LongName',
              trips: ['tripObjectId1', 'tripObjectId2']
          };
          const mockTrip = {
              agency_id: 'GVB',
              trip_id: 'trip123',
              route_id: 'route123',
              stop_times: ['stopTimeObjectId1', 'stopTimeObjectId2'],
              shapes: ['shapeObjectId1', 'shapeObjectId2']
          };

          // Mock VehiclePositions to return null
          VehiclePositions.findOne.mockResolvedValue(null);

          Route.findOne.mockImplementation(() => ({
              populate: jest.fn().mockResolvedValue(mockRoute)
          }));

          handleInactivity.mockResolvedValue(mockTrip);
          // Call the function with a route ID
          const result = await queryDbData.getBusDetails('route123');

          // Assertions
          expect(result.currentVehicle).toBeNull();
          expect(result.trip).toEqual(mockTrip);
          expect(result.congestionShape).toBeNull();
          // Add more assertions as needed for other properties
      });

      it('should throw an error when route is not found', async () => {
        // Arrange
        const routeID = 'nonexistentRoute';
        Route.findOne.mockResolvedValue(null);

        // Act and Assert
        await expect(queryDbData.getBusDetails(routeID)).rejects.toThrowError();
      });
    });



  });