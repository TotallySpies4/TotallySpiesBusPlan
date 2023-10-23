import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import {calculateDistance, realtimeAvgSpeedCalculator} from "../../../src/utils/speedCalculator.js";



jest.mock("../../../src/utils/speedCalculator.js", () => ({
    ...jest.requireActual("../../../src/utils/speedCalculator.js"),
    calculateDistance: jest.fn()
}));

describe("realtimeAvgSpeedCalculator", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should throw error for insufficient data", async () => {
        const vehiclePositions = [];
        const result = await realtimeAvgSpeedCalculator(vehiclePositions);
        expect(result).toBeUndefined();
    });

    it("should throw error for inconsistent routeId or tripId", async () => {
        const vehiclePositions = [
            { vehicle: { trip: { routeId: "1", tripId: "A" }, timestamp: 1000 } },
            { vehicle: { trip: { routeId: "2", tripId: "A" }, timestamp: 2000 } }
        ];
        const result = await realtimeAvgSpeedCalculator(vehiclePositions);
        expect(result).toBeUndefined();
    });

    it("should calculate average speed", async () => {
        calculateDistance.mockReturnValue(100);  // Mocking the return value for this test

        const vehiclePositions = [
            { vehicle: { trip: { routeId: "1", tripId: "A" }, timestamp: 1000, position: { longitude: 0, latitude: 0 } } },
            { vehicle: { trip: { routeId: "1", tripId: "A" }, timestamp: 2000, position: { longitude: 1, latitude: 1 } } }
        ];
        const result = await realtimeAvgSpeedCalculator(vehiclePositions);
        expect(result).toBeCloseTo(566097.7725789984);
    });

    it("should throw error for insufficient data based on timestamp differences", async () => {
        const vehiclePositions = [
            { vehicle: { trip: { routeId: "1", tripId: "A" }, timestamp: 1000, position: { longitude: 0, latitude: 0 } } },
            { vehicle: { trip: { routeId: "1", tripId: "A" }, timestamp: 1000, position: { longitude: 1, latitude: 1 } } }
        ];
        const result = await realtimeAvgSpeedCalculator(vehiclePositions);
        expect(result).toBeUndefined();
    });
});
