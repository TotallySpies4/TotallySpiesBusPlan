import { describe, it, expect } from '@jest/globals';
import {level} from "../../../src/utils/level.js";

describe('level', () => {
    it('should return 0 (green) if scheduled speed is more than 5 km/h higher than average speed', () => {
        const scheduleSpeed = 60;
        const routeAvgSpeed = 50;
        expect(level(scheduleSpeed, routeAvgSpeed)).toBe(0);
    });

    it('should return 1 (yellow) if scheduled speed is within 5 km/h of average speed', () => {
        const scheduleSpeed = 55;
        const routeAvgSpeed = 50;
        expect(level(scheduleSpeed, routeAvgSpeed)).toBe(1);

        const scheduleSpeedLower = 45;
        expect(level(scheduleSpeedLower, routeAvgSpeed)).toBe(2);
    });

    it('should return 2 (red) if scheduled speed is more than 5 km/h lower than average speed', () => {
        const scheduleSpeed = 40;
        const routeAvgSpeed = 50;
        expect(level(scheduleSpeed, routeAvgSpeed)).toBe(2);
    });
});
