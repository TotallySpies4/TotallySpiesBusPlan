import {
  getBusAllBuslineAmsterdam,
  getBusAllBuslineStockholm,
  getBusDetails,
  fetchAverageSpeed,
} from "../../../src/queryData/queryDbData.js";
import { Route, StopTime, Trip } from "../../../src/DBmodels/busline.js";
import { calculatorScheduledSpeedAmsterdam } from "../../../src/utils/speedCalculator.js";
import { VehiclePositions } from "../../../src/DBmodels/vehiclepositions.js";
import { getShapesBetweenStops } from "../../../src/utils/shapesUtilSet.js";
import { agency } from "../../../src/utils/enum.js";

jest.mock('../../../src/DBmodels/busline.js', () => ({
  Route: {
    find: jest.fn(),
    findOne: jest.fn().mockResolvedValue({ _id: 'someRouteObjID', trips: ['someTripID'] }),
  },
  Trip: {
    findOne: jest.fn(),
    populate: jest.fn(),
  },
  StopTime: {
    findOne: jest.fn(),
    populate: jest.fn(),
  },
}));

jest.mock('../../../src/DBmodels/vehiclepositions.js', () => ({
  VehiclePositions: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../../src/utils/shapesUtilSet.js', () => ({
  getShapesBetweenStops: jest.fn(),
}));

jest.mock('../../../src/utils/speedCalculator.js', () => ({
  calculatorScheduledSpeedAmsterdam: jest.fn(),
}));

describe('getBusAllBuslineAmsterdam', () => {
  it('should get all bus lines from Amsterdam', async () => {
    // Mock the behavior of the Route model
    Route.find.mockResolvedValueOnce([{ name: 'GVB' }]);

    const result = await getBusAllBuslineAmsterdam();

    // Assertions
    expect(Route.find).toHaveBeenCalledWith({ agency_id: agency.GVB });
    expect(result).toEqual([{ name: 'GVB' }]);
  });
});

describe('getBusAllBuslineStockholm', () => {
  it('should get all bus lines from Stockholm', async () => {
    // Mock the behavior of the Route model
    Route.find.mockResolvedValueOnce([{ name: 'SL' }]);

    const result = await getBusAllBuslineStockholm();

    // Assertions
    expect(Route.find).toHaveBeenCalledWith({ agency_id: agency.SL });
    expect(result).toEqual([{ name: 'SL' }]);
  });
});

describe('getBusDetails', () => {
  it('should get bus details', async () => {
    // Mock data
    const routeID = 'someRouteID';
    const route = {
      _id: 'someRouteObjID',
      trips: ['someTripID'],
    };
    const currentVehicle = {
      currentTrip_id: 'someTripID',
      congestion_level: {
        previousStop: 'previousStopID',
        currentStop: 'currentStopID',
      },
    };
    const trip = {
      _id: 'someTripID',
      stop_times: ['someStopTimeID'],
      shapes: ['someShapeID'],
    };
    const previousStopTime = 'previousStopID';
    const currentStopTime = 'currentStopID';
    const congestionShape = ['someShapeID'];

    // Mock the behavior of the Route model
    Route.findOne.mockResolvedValueOnce(route);

    // Mock the behavior of the VehiclePositions model
    VehiclePositions.findOne.mockResolvedValueOnce(currentVehicle);

    // Mock the behavior of the Trip model
    Trip.findOne.mockResolvedValueOnce(trip);

    // Mock the behavior of the getShapesBetweenStops function
    getShapesBetweenStops.mockResolvedValueOnce(congestionShape);

    // Call the getBusDetails function
    const result = await getBusDetails(routeID);

    // Assertions
    expect(Route.findOne).toHaveBeenCalledWith({ route_id: routeID });
    expect(VehiclePositions.findOne).toHaveBeenCalledWith({
      route: route._id,
    });
    expect(Trip.findOne).toHaveBeenCalledWith({
      _id: currentVehicle.currentTrip_id,
    });
    expect(getShapesBetweenStops).toHaveBeenCalledWith(
      trip.shapes,
      previousStopTime,
      currentStopTime
    );
    expect(result).toEqual({
      currentVehicle,
      trip,
      congestionShape,
    });
  });
});

describe('fetchAverageSpeed', () => {
  it('should fetch the average speed', async () => {
    // Mock data
    const routeID = 'someRouteID';
    const tripID = 'someTripID';
    const stopSequence = 42;
    const speedEntry = 30;
    const previousStop = 'previousStopID';
    const currentStop = 'currentStopID';

    // Mock the behavior of the StopTime model
    StopTime.findOne.mockResolvedValueOnce({
      shape_dist_traveled: 10,
    });
    StopTime.findOne.mockResolvedValueOnce({
      shape_dist_traveled: 20,
    });

    // Mock the behavior of the calculatorScheduledSpeedAmsterdam function
    calculatorScheduledSpeedAmsterdam.mockResolvedValueOnce(speedEntry);

    // Call the fetchAverageSpeed function
    const result = await fetchAverageSpeed(routeID, tripID, stopSequence);

    // Assertions
    expect(StopTime.findOne).toHaveBeenCalledWith({
      trip_id: tripID,
      stop_sequence: stopSequence - 1,
    });
    expect(StopTime.findOne).toHaveBeenCalledWith({
      trip_id: tripID,
      stop_sequence: stopSequence,
    });
    expect(calculatorScheduledSpeedAmsterdam).toHaveBeenCalledWith(
      routeID,
      10,
      20
    );
    expect(result).toEqual({
      speedEntry,
      previousStop,
      currentStop,
    });
  });
});
