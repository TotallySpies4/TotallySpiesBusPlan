import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import {Route, StopTime} from "../../../src/DBmodels/busline.js";
import {calculatorScheduledSpeedAmsterdam} from "../../../src/utils/speedCalculator.js";
import {fetchAverageSpeed} from "../../../src/queryData/fetchAverageSpeed.js";


jest.mock("../../../src/DBmodels/busline.js");
jest.mock("../../../src/DBmodels/vehiclepositions.js");
jest.mock("../../../src/utils/speedCalculator.js");
jest.mock("../../../src/DBmodels/busline.js", () => ({
    Route: {
        findOne: jest.fn()
    },
    StopTime: {
        findOne: jest.fn(),
    }
}));

describe('fetchAverageSpeed', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should calculate average speed for a given stop sequence equal 1', async () => {
        // Arrange: Set up mock data according to the stopTimeSchema
        const mockRoute = {
            _id: 'routeObjectId',
            agency_id: 'GVB',
            route_id: 'route123',
            route_short_name: 'ShortName',
            route_long_name: 'LongName',
            trips: [{trip_id: 'trip123', stop_times: ['stopTimeObjectId1', 'stopTimeObjectId2']}]
        };

        const mockCurrentStopTime = {
            agency_id: 'GVB',
            stop_id: 'stop1',
            stop_sequence: 1,
            arrival_time: '08:00:00',
            departure_time: '08:05:00',
            location: {latitude: 52.3676, longitude: 4.9041},
            stop_name: 'First Stop',
            shape_dist_traveled: 0.0,
            route: 'route123',
            trip_id: 'trip123'
        };

        const mockNextStopTime = {
            agency_id: 'GVB',
            stop_id: 'stop2',
            stop_sequence: 2,
            arrival_time: '08:10:00',
            departure_time: '08:15:00',
            location: {latitude: 52.3686, longitude: 4.9051},
            stop_name: 'Second Stop',
            shape_dist_traveled: 1.5,
            route: 'route123',
            trip_id: 'trip123'
        };

        // Mock database calls
        const populateMock = jest.fn().mockResolvedValue(mockRoute);
        Route.findOne.mockReturnValue({populate: populateMock});
        StopTime.findOne
            .mockResolvedValueOnce(mockCurrentStopTime) // This will be used for the current stop time
            .mockResolvedValueOnce(mockNextStopTime);   // This will be used for the next stop time

        calculatorScheduledSpeedAmsterdam.mockResolvedValue({average_speed: 30});

        // Act: Execute the function with mocked parameters
        const result = await fetchAverageSpeed('route123', 'trip123', 1);

        // Assert: Verify the function's behavior
        expect(Route.findOne).toHaveBeenCalledWith({route_id: 'route123'});
        expect(Route.findOne().populate).toHaveBeenCalledWith('trips');
        expect(StopTime.findOne).toHaveBeenNthCalledWith(1, {
            _id: {$in: mockRoute.trips[0].stop_times},
            stop_sequence: 1
        });
        expect(StopTime.findOne).toHaveBeenNthCalledWith(2, {
            _id: {$in: mockRoute.trips[0].stop_times},
            stop_sequence: 2
        });
        expect(calculatorScheduledSpeedAmsterdam).toHaveBeenCalledWith(mockCurrentStopTime, mockNextStopTime);
        expect(result).toEqual({
            speedEntry: {average_speed: 30},
            currentStop: mockNextStopTime,
            previousStop: mockCurrentStopTime
        });
    });

    it('should calculate average speed for a stop sequence greater than 1', async () => {
        // Arrange: Set up mock data according to the stopTimeSchema
        const mockRoute = {
            _id: 'routeObjectId',
            agency_id: 'GVB',
            route_id: 'route123',
            route_short_name: 'ShortName',
            route_long_name: 'LongName',
            trips: [{trip_id: 'trip123', stop_times: ['stopTimeObjectId1', 'stopTimeObjectId2']}]
        };

        const mockPreviousStopTime = {
            agency_id: 'GVB',
            stop_id: 'stop1',
            stop_sequence: 1,
            arrival_time: '08:00:00',
            departure_time: '08:05:00',
            location: {latitude: 52.3675, longitude: 4.9040},
            stop_name: 'Previous Stop',
            shape_dist_traveled: 0.5,
            route: 'route123',
            trip_id: 'trip123'
        };

        const mockCurrentStopTime = {
            agency_id: 'GVB',
            stop_id: 'stop2',
            stop_sequence: 2,
            arrival_time: '08:10:00',
            departure_time: '08:15:00',
            location: {latitude: 52.3686, longitude: 4.9051},
            stop_name: 'Current Stop',
            shape_dist_traveled: 1.5,
            route: 'route123',
            trip_id: 'trip123'
        };

        // Mock database calls
        const populateMock = jest.fn().mockResolvedValue(mockRoute);
        Route.findOne.mockReturnValue({ populate: populateMock });

        StopTime.findOne.mockImplementation(query => {
            if (query.stop_sequence === mockCurrentStopTime.stop_sequence) {
                return Promise.resolve(mockCurrentStopTime);
            } else if (query.stop_sequence === mockPreviousStopTime.stop_sequence) {
                return Promise.resolve(mockPreviousStopTime);
            }
        });

        calculatorScheduledSpeedAmsterdam.mockResolvedValue({ average_speed: 30 });

        // Act: Execute the function with mocked parameters for stopSequence > 1
        const result = await fetchAverageSpeed('route123', 'trip123', 2);

        // Assert: Verify the function's behavior for stopSequence > 1
        expect(Route.findOne).toHaveBeenCalledWith({ route_id: 'route123' });
        expect(Route.findOne().populate).toHaveBeenCalledWith('trips');
        expect(StopTime.findOne).toHaveBeenNthCalledWith(1, {
            _id: { $in: mockRoute.trips[0].stop_times },
            stop_sequence: 2
        });
        expect(StopTime.findOne).toHaveBeenNthCalledWith(2, {
            _id: { $in: mockRoute.trips[0].stop_times },
            stop_sequence: 1
        });
        expect(calculatorScheduledSpeedAmsterdam).toHaveBeenCalledWith(mockPreviousStopTime, mockCurrentStopTime);
        expect(result).toEqual({
            speedEntry: { average_speed: 30 },
            currentStop: mockCurrentStopTime,
            previousStop: mockPreviousStopTime
        });
    });

    it('should throw an error when no matching route is found', async () => {
        // Arrange: Mock Route.findOne to return null
        Route.findOne.mockImplementation(() => ({
            populate: jest.fn().mockResolvedValue(null)
        }));

        // Act & Assert: Expect the function to throw an error
        await expect(fetchAverageSpeed('nonexistentRouteId', 'trip123', 1))
            .rejects
            .toThrow('No matching route found in database.');

        // Verify that Route.findOne was called with the correct route ID
        expect(Route.findOne).toHaveBeenCalledWith({ route_id: 'nonexistentRouteId' });
    });

    it('should throw an error when no matching trip is found for the provided route', async () => {
        // Arrange: Set up mock data with a route that does not have the specified trip
        const mockRoute = {
            _id: 'routeObjectId',
            agency_id: 'GVB',
            route_id: 'route123',
            route_short_name: 'ShortName',
            route_long_name: 'LongName',
            trips: [{trip_id: 'otherTripId', stop_times: ['stopTimeObjectId1', 'stopTimeObjectId2']}]
        };

        // Mock Route.findOne to return the route with trips that do not match the given tripID
        Route.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockRoute)
        });

        // Act & Assert: Expect the function to throw an error for the non-existent trip
        await expect(fetchAverageSpeed('route123', 'nonexistentTripId', 1))
            .rejects
            .toThrow('No matching trip found for the provided route.');

        // Verify that Route.findOne was called with the correct route ID
        expect(Route.findOne).toHaveBeenCalledWith({ route_id: 'route123' });
        expect(Route.findOne().populate).toHaveBeenCalledWith('trips');
    });

    it('should throw an error when stop time data is not found for the given sequence', async () => {
        // Arrange: Mock Route with a trip that has stop times
        const mockRoute = {
            _id: 'routeObjectId',
            agency_id: 'GVB',
            route_id: 'route123',
            route_short_name: 'ShortName',
            route_long_name: 'LongName',
            trips: [{trip_id: 'trip123', stop_times: ['stopTimeObjectId1', 'stopTimeObjectId2']}]
        };

        // Mock Route.findOne to return the route with the trip
        Route.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockRoute)
        });

        // Mock StopTime.findOne to return null, simulating no matching stop time data found
        StopTime.findOne.mockResolvedValue(null);

        // Act & Assert: Expect the function to throw an error for the missing stop time data
        await expect(fetchAverageSpeed('route123', 'trip123', 3)) // Using a stopSequence not in mock data
            .rejects
            .toThrow('Stop time data not found for the given sequence.');

        // Verify that StopTime.findOne was called with the correct parameters
        expect(StopTime.findOne).toHaveBeenCalledWith({
            _id: { $in: mockRoute.trips[0].stop_times },
            stop_sequence: 3 // The sequence number that is not present in the mock data
        });
    });


});




