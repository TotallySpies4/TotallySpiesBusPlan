import {describe, expect, it} from "@jest/globals";
import {calculateScheduledSpeed, findNearestStop} from "../../../src/utils/speedCalculator.js";

describe('findNearestStop', () => {
    it('should find the nearest stop to a given location', () => {
        const stopTimes = [
            { location: { latitude: 40.7128, longitude: -74.0060 } }, // New York City
            { location: { latitude: 34.0522, longitude: -118.2437 } }, // Los Angeles
            { location: { latitude: 41.8781, longitude: -87.6298 } }, // Chicago
        ];
        const lat = 38.8951;
        const lon = -77.0369;
        const expectedStop = stopTimes[0];
        const nearestStop = findNearestStop(stopTimes, lat, lon);
        expect(nearestStop).toEqual(expectedStop);
    });

    it('should calculate the scheduled speed correctly', () => {
        // Beispiel-Stop-Zeiten und Koordinaten
        const previousStop = {
            location: { latitude: 40.7128, longitude: -74.0060 }, // New York City
            departure_time: '08:00:00',
        };
        const currentStop = {
            location: { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
            arrival_time: '12:00:00',
        };
        const expectedDistance = 3944.9; // Kilometer

        // Die geografische Entfernung wird mit der Zeitdifferenz multipliziert, um die geplante Geschwindigkeit zu berechnen
        const expectedSpeed = expectedDistance / 4; // 4 Stunden
        const tolerance = 5;

        // Funktion aufrufen
        const calculatedSpeed = calculateScheduledSpeed(previousStop, currentStop);

        expect(calculatedSpeed).toBeGreaterThanOrEqual(expectedSpeed - tolerance);
        expect(calculatedSpeed).toBeLessThanOrEqual(expectedSpeed + tolerance);
    });
});