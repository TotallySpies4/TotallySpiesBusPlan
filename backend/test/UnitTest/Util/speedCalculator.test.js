
import * as speedCalculator from "../../../src/utils/speedCalculator.js";
import {afterEach, beforeEach, describe, expect, it, jest} from "@jest/globals";

describe("calculatorScheduledSpeedAmsterdam", () => {

    it('should calculate the average speed correctly for valid inputs', async () => {
        const previousStop = {
            location: { longitude: 0, latitude: 0 },
            departure_time: "08:00:00"
        };
        const currentStop = {
            location: { longitude: 10, latitude: 10 },
            arrival_time: "09:00:00"
        };

        const speed = await speedCalculator.calculatorScheduledSpeedAmsterdam(previousStop, currentStop);
        expect(speed).toBeCloseTo(1568.5201210985422);
    });

    it("should handle errors and throw an exception", async () => {
        await expect(speedCalculator.calculatorScheduledSpeedAmsterdam(null, null)).rejects.toThrow("Error calculating speed:");
    });

});
