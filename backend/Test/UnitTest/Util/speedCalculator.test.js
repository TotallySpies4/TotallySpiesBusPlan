import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import {
    calculateDistance, calculateTimeDifference,
    calculatorScheduledSpeedAmsterdam
} from "../../../src/utils/speedCalculator.js";



// Mock the imported methods
jest.mock("../../../src/utils/speedCalculator.js", () => ({
    ...jest.requireActual("../../../src/utils/speedCalculator.js"),
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
            },
            departure_time: "12:00:00"
        };
        const mockCurrentStop = {
            location: {
                latitude: 51,
                longitude: 51
            },
            departure_time: "14:00:00"
        };

        calculateDistance.mockReturnValue(100); // mock distance: 100 units
        calculateTimeDifference.mockReturnValue(2); // mock time difference: 2 hours

        console.log("Distance:", calculateDistance(50, 51, 50, 51));
        console.log("Time difference:", calculateTimeDifference(mockPreviousStop, mockCurrentStop));


        const result = await calculatorScheduledSpeedAmsterdam(mockPreviousStop, mockCurrentStop);

        expect(calculateDistance).toHaveBeenCalledWith(50, 51, 50, 51);
        expect(calculateTimeDifference).toHaveBeenCalledWith(mockPreviousStop, mockCurrentStop);
        expect(result).toBe(180000);
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

        const result = await calculatorScheduledSpeedAmsterdam(mockPreviousStop, mockCurrentStop);

        expect(result).toBeNull();
    });
});
