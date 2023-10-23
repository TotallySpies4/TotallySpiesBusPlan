import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import {
    calculateDistance,
    segmentAvgSpeedCalculator,
    calculateTimeDifference
} from "../../../src/utils/speedCalculator.js";



// Mock the imported methods
jest.mock("../../../src/utils/speedCalculator.js", () => ({
    calculateDistance: jest.fn(),
    calculateTimeDifference: jest.fn()
}));

describe("calculateSpeedForRoute", () => {
    beforeEach(() => {
        // Reset the mocks before each test
        calculateDistance.mockClear();
        calculateTimeDifference.mockClear();
    });

    it("should calculate the speed for a route", async () => {
        const mockPreviousStop = {
            location: {
                latitude: 50,
                longitude: 50
            }
        };
        const mockCurrentStop = {
            location: {
                latitude: 51,
                longitude: 51
            }
        };

        calculateDistance.mockReturnValue(100); // mock distance: 100 units
        calculateTimeDifference.mockReturnValue(2); // mock time difference: 2 hours

        const result = await segmentAvgSpeedCalculator(mockPreviousStop, mockCurrentStop);

        expect(calculateDistance).toHaveBeenCalledWith(50, 50, 51, 51);
        expect(calculateTimeDifference).toHaveBeenCalledWith(mockPreviousStop, mockCurrentStop);
        expect(result).toBe(180000); // (100 units / 2 hours) * 3600 = 50 units per hour
    });

    it("should handle errors and return null", async () => {
        const mockPreviousStop = {
            location: {
                latitude: 50,
                longitude: 50
            }
        };
        const mockCurrentStop = {
            location: {
                latitude: 51,
                longitude: 51
            }
        };

        // Mock an error
        calculateDistance.mockImplementation(() => {
            throw new Error("Mocked error");
        });

        const result = await segmentAvgSpeedCalculator(mockPreviousStop, mockCurrentStop);

        expect(result).toBeNull();
    });
});
