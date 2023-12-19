import { describe, it, jest, expect } from '@jest/globals';
import {handleInactivity} from "../../../src/utils/querydataUtil.js";
import {Trip} from "../../../src/DBmodels/busline.js";

jest.mock("../../../src/DBmodels/busline.js", () => ({
    Trip: {
        findOne: jest.fn()
    }
}));

describe('handleInactivity', () => {
    it('should find and populate trip data', async () => {
        // Mock data
        const mockRoute = {
            trips: ['tripId']
        };

        const mockTrip = {
            _id: 'tripId',
            stop_times: [],
            shapes: []
        };

        // Mock implementation
        Trip.findOne.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTrip)
            })
        });

        // Call the function
        const result = await handleInactivity(mockRoute);

        // Assertions
        expect(Trip.findOne).toHaveBeenCalledWith({_id: 'tripId'});
        expect(result).toEqual(mockTrip);
    });
});
